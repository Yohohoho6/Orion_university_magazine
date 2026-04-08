import { Card, CardBody, Input, Textarea, Select, SelectItem, Spinner } from "@heroui/react";
import { useCategories } from "../hooks/useCategories";
import { useEffect, useState } from "react";
import { HiPhoto } from "react-icons/hi2";

export function DetailsForm({
  contributionType,
  formData,
  onFormDataChange,
  coverPhoto,
  onCoverPhotoChange,
  initialCoverPhotoUrl = null,
  initialCoverPhotoName = "Current cover photo",
  allowCoverPhotoRemoval = true,
}) {
  const { data: catsRes, isPending: catsLoading } = useCategories();

  const allCategories = catsRes?.data ?? [];

  const categories = allCategories.filter((cat) => {
    if (contributionType === "article") return cat.type === "article";
    if (contributionType === "photography") return cat.type === "gallery";
    return false;
  });

  const loadingDropdowns = catsLoading;
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onCoverPhotoChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeCoverPhoto = () => {
    onCoverPhotoChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const inputClassNames = {
    label: "text-sm font-medium text-gray-900 dark:text-gray-100",
    inputWrapper: "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50",
    input: "text-gray-900 dark:text-gray-100",
  };

  return (
    <Card
      shadow="none"
      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      radius="lg"
    >
      <CardBody className="p-4 sm:p-6">
        <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
          {contributionType === "article" ? "Article Details" : "Photography Details"}
        </h2>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Title */}
          <Input
            label="Title"
            placeholder={
              contributionType === "article"
                ? "Enter your article title"
                : "Enter your photo title"
            }
            value={formData.title}
            onValueChange={(val) => onFormDataChange({ title: val })}
            variant="bordered"
            isRequired
            labelPlacement="outside"
            classNames={inputClassNames}
          />

          {/* Abstract / Caption */}
          {contributionType === "article" ? (
            <Textarea
              label="Abstract"
              placeholder="Provide a brief summary of your article (max 300 words)"
              value={formData.abstract}
              onValueChange={(val) => onFormDataChange({ abstract: val })}
              variant="bordered"
              isRequired
              labelPlacement="outside"
              minRows={4}
              classNames={inputClassNames}
            />
          ) : (
            <Textarea
              label="Image Caption"
              placeholder="Describe your photograph"
              value={formData.description}
              onValueChange={(val) => onFormDataChange({ description: val })}
              variant="bordered"
              isRequired
              labelPlacement="outside"
              minRows={3}
              classNames={inputClassNames}
            />
          )}

          {/* Category */}
          <Select
            label="Category"
            placeholder={loadingDropdowns ? "Loading…" : "Select a category"}
            selectedKeys={formData.category_id ? [String(formData.category_id)] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              onFormDataChange({ category_id: selected });
            }}
            variant="bordered"
            isRequired
            isDisabled={loadingDropdowns}
            labelPlacement="outside"
            startContent={loadingDropdowns ? <Spinner size="sm" /> : null}
            classNames={{
              label: "text-sm font-medium text-gray-900 dark:text-gray-100",
              trigger: "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900/50",
              value: "text-gray-900 dark:text-gray-100",
            }}
          >
            {categories.map((cat) => (
              <SelectItem key={String(cat.id)} textValue={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </Select>

          {/* Cover Photo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Cover Photo{" "}
              <span className="text-gray-500 dark:text-gray-400 font-normal">(Optional)</span>
            </label>

            {/* Existing cover photo preview */}
            {!coverPhoto && initialCoverPhotoUrl && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={initialCoverPhotoUrl}
                    alt="Current cover"
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {initialCoverPhotoName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload a new image to replace it.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload dropzone */}
            {!coverPhoto ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 px-4 py-6 transition-colors hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                <HiPhoto className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {initialCoverPhotoUrl ? "Replace Cover Photo" : "Upload Cover Photo"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    JPG, JPEG, PNG up to 2MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleCoverPhotoChange}
                  className="hidden"
                />
              </label>
            ) : (
              /* Selected cover photo preview */
              <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3">
                <div className="flex items-center gap-3">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Cover preview"
                      className="h-16 w-16 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                      {coverPhoto.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(coverPhoto.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  {allowCoverPhotoRemoval && (
                    <button
                      type="button"
                      onClick={removeCoverPhoto}
                      className="rounded-lg bg-red-100 dark:bg-red-950/50 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-200 dark:hover:bg-red-900/50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}