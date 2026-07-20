
import React from "react";
import { Plus, Trash2 } from "lucide-react";

const ProjectForm = ({ data = [], onChange }) => {
  const addProject = () => {
    const newProject = {
      name: "",
      tech: "",
      description: "",
      link: "",
    };

    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Projects
          </h3>
          <p className="text-sm text-gray-500">
            Add your project work
          </p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project #{index + 1}</h4>

              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                type="text"
                placeholder="Project Name"
                value={project.name || ""}
                onChange={(e) =>
                  updateProject(index, "name", e.target.value)
                }
                className="px-3 py-2 text-sm border rounded-lg"
              />

              <input
                type="text"
                placeholder="Tech Stack (e.g., React, Node.js)"
                value={project.tech || ""}
                onChange={(e) =>
                  updateProject(index, "tech", e.target.value)
                }
                className="px-3 py-2 text-sm border rounded-lg"
              />

              <textarea
                rows={4}
                placeholder="Describe your project"
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none"
              />

              <input
                type="url"
                placeholder="Project Link (optional)"
                value={project.link || ""}
                onChange={(e) =>
                  updateProject(index, "link", e.target.value)
                }
                className="px-3 py-2 text-sm border rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;