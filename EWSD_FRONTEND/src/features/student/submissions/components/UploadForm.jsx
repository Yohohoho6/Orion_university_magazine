import { Card, CardBody } from "@heroui/react";
import { useCallback, useState } from "react";
import { HiUpload } from "react-icons/hi";
import { LuFileText, LuImage, LuX } from "react-icons/lu";

export function UploadForm({
  contributionType,
  files,
  onFilesChange,
  existingFileName = null,
  requireFile = true,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const accept =
    contributionType === "article"
      ? ".doc,.docx,.pdf"
      : ".jpg,.jpeg,.png,.tiff,.raw";

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesChange(droppedFiles.length > 0 ? [droppedFiles[0]] : []);
    },
    [onFilesChange],
  );

  const handleFileInput = useCallback(
    (e) => {
      if (e.target.files) {
        const selected = Array.from(e.target.files);
        onFilesChange(selected.length > 0 ? [selected[0]] : []);
      }
    },
    [onFilesChange],
  );

  const removeFile = useCallback(
    (index) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange],
  );

  return (
    <Card
      shadow="none"
      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      radius="lg"
    >
      <CardBody className="p-4 sm:p-6">
        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          Upload {contributionType === "article" ? "Document" : "Images"}
        </h2>

        {/* Existing file notice */}
        {existingFileName && files.length === 0 && (
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Current file</p>
            <p className="mt-1 truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {existingFileName}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Upload a new file only if you want to replace this file.
            </p>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 sm:p-10 transition-colors ${
            isDragOver
              ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40"
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50"
          }`}
        >
          <HiUpload className="mb-3 h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" />
          <p className="mb-1 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
            Drag and drop your files here
          </p>
          <p className="mb-4 text-xs text-gray-400 dark:text-gray-500 text-center">
            or click to browse files
          </p>
          <label className="cursor-pointer rounded-lg bg-blue-900 dark:bg-blue-600 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-blue-800 dark:hover:bg-blue-500">
            Browse Files
            <input
              type="file"
              accept={accept}
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
            {contributionType === "article"
              ? "Accepted formats: .doc, .docx (Max 5MB)"
              : "Accepted formats: .jpg, .jpeg, .png (Max 5MB each)"}
          </p>
          {!requireFile && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 text-center">
              File replacement is optional during edit.
            </p>
          )}
        </div>

        {/* Uploaded files list */}
        {files.length > 0 && (
          <div className="mt-4 sm:mt-5 flex flex-col gap-2 sm:gap-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Uploaded Files
            </h3>
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-2.5 sm:p-3"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {contributionType === "article" ? (
                    <LuFileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400 shrink-0" />
                  ) : (
                    <LuImage className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-2 rounded-full p-1 text-gray-400 dark:text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500 dark:hover:text-red-400 shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <LuX className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}