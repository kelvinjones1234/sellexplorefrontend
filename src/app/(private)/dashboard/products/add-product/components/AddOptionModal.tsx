import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import FancySelect from "./FancySelect";
import { ProductOption } from "../types";
import { apiClient } from "../api";

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: ProductOption) => void;
  initialOption: ProductOption | null;
}

const OptionModal: React.FC<OptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOption,
}) => {
  const [optionNames, setOptionNames] = useState<
    { option: string; price: string }[]
  >(
    initialOption?.options?.map((opt) => {
      const [option, price] = opt.includes(":") ? opt.split(":") : [opt, ""];
      return { option: option || "", price: price || "" };
    }) || [{ option: "", price: "" }]
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(
    initialOption?.template_name || null
  );
  const [saveAsTemplate, setSaveAsTemplate] = useState(
    initialOption?.as_template || false
  );
  const [templateName, setTemplateName] = useState("");
  const [note, setNote] = useState(initialOption?.note?.note || "");
  const [templateOptions, setTemplateOptions] = useState<
    { value: string; label: string; options: string[] }[]
  >([]);
  const [view, setView] = useState<"initial" | "new" | "template">(
    initialOption?.template_name
      ? "template"
      : initialOption
      ? "new"
      : "initial"
  );

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await apiClient.getOptionTemplates();
        setTemplateOptions(
          templates
            .filter((tpl) => tpl.template_name && tpl.as_template)
            .map((tpl) => ({
              value: tpl.template_name!,
              label: tpl.template_name!,
              options: tpl.options || [],
            }))
        );
      } catch (err) {
        console.error("Failed to load option templates:", err);
      }
    };

    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setOptionNames(
        initialOption?.options?.map((opt) => {
          const [option, price] = opt.includes(":")
            ? opt.split(":")
            : [opt, ""];
          return { option: option || "", price: price || "" };
        }) || [{ option: "", price: "" }]
      );
      setSelectedTemplate(initialOption?.template_name || null);
      setSaveAsTemplate(initialOption?.as_template || false);
      setTemplateName("");
      setNote(initialOption?.note?.note || "");
      setView(
        initialOption?.template_name
          ? "template"
          : initialOption
          ? "new"
          : "initial"
      );
    }
  }, [isOpen, initialOption]);

  const handleOptionChange = (
    index: number,
    field: "option" | "price",
    value: string
  ) => {
    const updated = [...optionNames];
    updated[index] = { ...updated[index], [field]: value };
    setOptionNames(updated);
    setSelectedTemplate(null);
  };

  const handleAddField = () => {
    setOptionNames([...optionNames, { option: "", price: "" }]);
    setSelectedTemplate(null);
  };

  const handleDone = () => {
    if (view === "new") {
      const cleanedOptions = optionNames
        .filter((item) => item.option.trim() !== "")
        .map((item) => {
          if (item.price.trim() === "") {
            return item.option;
          }
          if (item.option.includes(":")) {
            alert("Option name cannot contain ':'");
            throw new Error("Invalid option name");
          }
          if (item.price.trim() !== "" && isNaN(Number(item.price))) {
            alert("Price must be a valid number if provided");
            throw new Error("Invalid price");
          }
          return `${item.option}:${item.price}`;
        });

      if (cleanedOptions.length === 0) {
        alert("At least one option name is required");
        return;
      }

      if (saveAsTemplate && !templateName.trim()) {
        alert("Please provide a template name to save");
        return;
      }

      const newOption: ProductOption = {
        id: initialOption?.id || 0,
        product: initialOption?.product || 0,
        options: cleanedOptions,
        as_template: saveAsTemplate,
        template_name: saveAsTemplate ? templateName : null,
        note: note
          ? {
              id: initialOption?.note?.id || 0,
              product: 0,
              note,
              created_at: "",
              updated_at: "",
            }
          : null,
        created_at: initialOption?.created_at || "",
        updated_at: initialOption?.updated_at || "",
      };

      if (newOption.template_name === null) {
        delete newOption.template_name;
      }

      console.log("Saving new option:", newOption);
      onSave(newOption);
    } else if (view === "template") {
      if (!selectedTemplate) {
        alert("Please select a template");
        return;
      }

      const selectedTemplateData = templateOptions.find(
        (tpl) => tpl.value === selectedTemplate
      );

      if (!selectedTemplateData) {
        alert("Selected template not found");
        return;
      }

      if (
        !selectedTemplateData.options ||
        selectedTemplateData.options.length === 0
      ) {
        alert("Selected template has no options or is invalid");
        return;
      }

      const newOption: ProductOption = {
        id: initialOption?.id || 0,
        product: initialOption?.product || 0,
        options: selectedTemplateData.options,
        as_template: false,
        template_name: null,
        note: note
          ? {
              id: initialOption?.note?.id || 0,
              product: 0,
              note,
              created_at: "",
              updated_at: "",
            }
          : null,
        created_at: initialOption?.created_at || "",
        updated_at: initialOption?.updated_at || "",
      };

      if (newOption.template_name === null) {
        delete newOption.template_name;
      }

      console.log("Saving template option:", newOption);
      onSave(newOption);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              {initialOption ? "Edit Product Option" : "Add Product Option"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {view === "initial" && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setView("new");
                  setSelectedTemplate(null);
                  setOptionNames([{ option: "", price: "" }]);
                  setTemplateName("");
                }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-xl transition"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm font-semibold">New Option</span>
                <span className="text-xs text-center">Create a new set of product options</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("template");
                  setOptionNames([{ option: "", price: "" }]);
                  setSaveAsTemplate(false);
                  setTemplateName("");
                }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-xl transition"
              >
                <svg
                  className="w-8 h-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-6h6v6m-6 0h6m4 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2z"
                  />
                </svg>
                <span className="text-sm font-semibold">Use Template</span>
                <span className="text-xs text-center">Select from saved option templates</span>
              </button>
            </div>
          )}

          {view === "new" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                Option(s)
              </label>
              <div className="space-y-3">
                {optionNames.map((item, index) => (
                  <div key={index} className="flex gap-x-3">
                    <FloatingLabelInput
                      type="text"
                      name={`option-${index}`}
                      placeholder={`Option ${index + 1}`}
                      value={item.option}
                      onChange={(e) =>
                        handleOptionChange(index, "option", e.target.value)
                      }
                    />
                    <FloatingLabelInput
                      type="text"
                      name={`price-${index}`}
                      placeholder={`Price (Optional)`}
                      value={item.price}
                      onChange={(e) =>
                        handleOptionChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddField}
                className="bg-[var(--color-bg-secondary)] px-4 text-[var(--color-brand-primary)] py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:text-[var(--color-brand-hover)]"
                aria-label="Add another option"
              >
                <Plus className="w-4 h-4" />
                Add Another
              </button>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  Save as template
                </span>
                <button
                  onClick={() => setSaveAsTemplate(!saveAsTemplate)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    saveAsTemplate
                      ? "bg-[var(--color-brand-primary)]"
                      : "bg-[var(--color-border-default)] dark:bg-[var(--color-border-strong)]"
                  }`}
                  aria-label={`Toggle save as template: ${saveAsTemplate ? "on" : "off"}`}
                  role="switch"
                  aria-checked={saveAsTemplate}
                >
                  <span
                    className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      saveAsTemplate
                        ? "translate-x-6 bg-[var(--color-on-brand)]"
                        : "translate-x-0 bg-[var(--color-bg-primary)] dark:bg-[var(--color-text-primary)]"
                    }`}
                  />
                </button>
              </div>

              {saveAsTemplate && (
                <FloatingLabelInput
                  type="text"
                  name="templateName"
                  placeholder="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              )}

              <FloatingLabelTextarea
                name="note"
                placeholder="Option note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}

          {view === "template" && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                Select a saved template
              </label>
              <FancySelect
                name="template"
                options={templateOptions}
                value={selectedTemplate}
                onChange={(val) => {
                  setSelectedTemplate(val);
                  const template = templateOptions.find(
                    (tpl) => tpl.value === val
                  );
                  if (template) {
                    setOptionNames(
                      template.options?.length > 0
                        ? template.options.map((opt) => {
                            const [option, price] = opt.includes(":")
                              ? opt.split(":")
                              : [opt, ""];
                            return { option: option || "", price: price || "" };
                          })
                        : [{ option: "", price: "" }]
                    );
                    setTemplateName("");
                  }
                }}
                placeholder="Select a template"
                margin="mb-0"
              />
              {selectedTemplate && (
                <div className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Options:{" "}
                  {templateOptions
                    .find((tpl) => tpl.value === selectedTemplate)
                    ?.options.map((opt) => {
                      const [name, price] = opt.includes(":")
                        ? opt.split(":")
                        : [opt, ""];
                      return price ? `${name} (NGN ${price})` : name;
                    })
                    .join(", ") || "None"}
                </div>
              )}
              <FloatingLabelTextarea
                name="note"
                placeholder="Option note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {view !== "initial" && (
          <div className="flex-shrink-0 p-6 pt-0 flex justify-end gap-4">
            <button
              onClick={() => setView("initial")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
              aria-label="Go back"
            >
              Back
            </button>
            <button
              onClick={handleDone}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition"
              aria-label="Save option"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionModal;