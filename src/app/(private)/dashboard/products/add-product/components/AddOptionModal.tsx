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
  const [optionNames, setOptionNames] = useState<string[]>(
    initialOption?.options || [""]
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
    initialOption?.template_name ? "template" : initialOption ? "new" : "initial"
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
        initialOption?.options?.length > 0 ? initialOption.options : [""]
      );
      setSelectedTemplate(initialOption?.template_name || null);
      setSaveAsTemplate(initialOption?.as_template || false);
      setTemplateName("");
      setNote(initialOption?.note?.note || "");
      setView(
        initialOption?.template_name ? "template" : initialOption ? "new" : "initial"
      );
    }
  }, [isOpen, initialOption]);

  const handleChange = (index: number, value: string) => {
    const updated = [...optionNames];
    updated[index] = value;
    setOptionNames(updated);
    setSelectedTemplate(null);
  };

  const handleAddField = () => {
    setOptionNames([...optionNames, ""]);
    setSelectedTemplate(null);
  };

  const handleDone = () => {
    if (view === "new") {
      const cleanedOptions = optionNames.filter((n) => n.trim() !== "");
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

      if (!selectedTemplateData.options || selectedTemplateData.options.length === 0) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center p-6 border-b border-[var(--color-border-secondary)]">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialOption ? "Edit Product Option" : "Add Product Option"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {view === "initial" && (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setView("new");
                  setSelectedTemplate(null);
                  setOptionNames([""]);
                  setTemplateName("");
                }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl transition shadow-sm"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-lg font-semibold">New Option</span>
                <span className="text-sm text-center text-gray-600 group-hover:text-white">
                  Create a new set of product options
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("template");
                  setOptionNames([""]);
                  setSaveAsTemplate(false);
                  setTemplateName("");
                }}
                className="flex flex-col items-center justify-center p-6 bg-[var(--color-border)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl transition shadow-sm"
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
                <span className="text-lg font-semibold">Use Template</span>
                <span className="text-sm text-center text-gray-600 group-hover:text-white">
                  Select from saved option templates
                </span>
              </button>
            </div>
          )}

          {view === "new" && (
            <div className="border border-[var(--color-border-secondary)] rounded-xl p-4 shadow-xs space-y-4">
              <label className="block text-sm font-medium text-[var(--color-body)] mb-2">
                Option(s)
              </label>
              <div className="space-y-3">
                {optionNames.map((name, index) => (
                  <FloatingLabelInput
                    key={index}
                    type="text"
                    name={`option-${index}`}
                    placeholder={`Enter option ${index + 1}`}
                    value={name}
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddField}
                className="mt-3 flex items-center gap-2 px-3 py-2 text-sm font-medium text-[var(--color-primary)] border border-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] hover:text-white transition"
              >
                <Plus className="w-4 h-4" />
                Add Another
              </button>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-medium text-[var(--color-body)]">
                  Save as template
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={saveAsTemplate}
                    onChange={(e) => setSaveAsTemplate(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
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
            <div className="border border-[var(--color-border-secondary)] rounded-xl p-4 space-y-4">
              <label className="block text-sm font-medium text-[var(--color-body)] mb-2">
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
                      template.options?.length > 0 ? template.options : [""]
                    );
                    setTemplateName("");
                  }
                }}
                placeholder="Select a template"
                margin="mb-0"
              />
              {selectedTemplate && (
                <div className="mt-2 text-sm text-gray-600">
                  Options:{" "}
                  {templateOptions
                    .find((tpl) => tpl.value === selectedTemplate)
                    ?.options.join(", ") || "None"}
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
          <div className="flex justify-end gap-2 p-6 border-t border-[var(--color-border-secondary)]">
            <button
              onClick={() => setView("initial")}
              className="px-4 py-2 bg-[var(--color-border)] hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition"
            >
              Back
            </button>
            <button
              onClick={handleDone}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold transition"
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