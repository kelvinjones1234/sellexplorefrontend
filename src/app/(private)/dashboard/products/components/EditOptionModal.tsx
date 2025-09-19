"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea"; // ✅ textarea
import FancySelect from "../add-product/components/FancySelect";
import { ProductOption } from "../add-product/types";
import { apiClient } from "../add-product/api";

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: ProductOption) => void;
  initialOption?: ProductOption;
}

const OptionModal: React.FC<OptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOption,
}) => {
  const [optionNames, setOptionNames] = useState<string[]>(
    initialOption ? [initialOption.name] : [""]
  );

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [note, setNote] = useState(""); // ✅ note state

  const [templateOptions, setTemplateOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [mode, setMode] = useState<"new" | "template">("new"); // ✅ toggle

  // fetch templates from API on modal open
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await apiClient.getOptionTemplates();
        setTemplateOptions(
          templates
            .filter((tpl) => tpl.template_name)
            .map((tpl) => ({
              value: tpl.template_name!,
              label: tpl.template_name!,
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

  const handleChange = (index: number, value: string) => {
    const updated = [...optionNames];
    updated[index] = value;
    setOptionNames(updated);
  };

  const handleAddField = () => {
    setOptionNames([...optionNames, ""]);
  };

  const handleSave = () => {
    if (mode === "new") {
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
        id: 0,
        product: 0, // backend attaches the product later
        options: cleanedOptions,
        as_template: saveAsTemplate,
        template_name: saveAsTemplate ? templateName : null,
        note: note
          ? { id: 0, product: 0, note, created_at: "", updated_at: "" }
          : null,
        created_at: "",
        updated_at: "",
      };

      onSave(newOption);
    } else {
      if (!selectedTemplate) {
        alert("Please select a template");
        return;
      }

      const newOption: ProductOption = {
        id: 0,
        product: 0,
        options: [], // backend should hydrate with template options
        as_template: true,
        template_name: selectedTemplate,
        note: note
          ? { id: 0, product: 0, note, created_at: "", updated_at: "" }
          : null,
        created_at: "",
        updated_at: "",
      };

      onSave(newOption);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md h-[90vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        {/* Header */}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-3 mb-4">
            <button
              type="button"
              onClick={() => setMode("new")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                mode === "new"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-border)]"
              }`}
            >
              New Option
            </button>
            <button
              type="button"
              onClick={() => setMode("template")}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                mode === "template"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-border)]"
              }`}
            >
              Use Template
            </button>
          </div>

          {/* New Option Form */}
          {mode === "new" && (
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

              {/* Save as template toggle */}
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

              {/* ✅ Note */}
              <FloatingLabelTextarea
                name="note"
                placeholder="Option note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}

          {/* Template Option Form */}
          {mode === "template" && (
            <div className="border border-[var(--color-border-secondary)] rounded-xl p-4 space-y-4">
              <label className="block text-sm font-medium text-[var(--color-body)] mb-2">
                Select a saved template
              </label>
              <FancySelect
                name="template"
                options={templateOptions}
                value={selectedTemplate}
                onChange={(val) => setSelectedTemplate(val)}
                placeholder="Select a template"
                margin="mb-0"
              />

              {/* ✅ Note */}
              <FloatingLabelTextarea
                name="note"
                placeholder="Option note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-6 border-t border-[var(--color-border-secondary)]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-border)] hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
