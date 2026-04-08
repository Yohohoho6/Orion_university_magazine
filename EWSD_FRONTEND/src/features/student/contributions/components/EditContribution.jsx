import { useMemo, useState } from "react";
import { Button, Card, CardBody, Spinner } from "@heroui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Stepper } from "@/features/student/submissions/components/Stepper";
import { DetailsForm } from "@/features/student/submissions/components/DetailsForm";
import { UploadForm } from "@/features/student/submissions/components/UploadForm";
import { useContributionById } from "../hooks/useContributionById";
import { useUpdateContribution } from "../hooks/useUpdateContribution";
import { useCategories } from "../../submissions/hooks/useCategories";

const steps = [
  { number: 1, label: "Details" },
  { number: 2, label: "Upload" },
];

const getFileNameFromPath = (path) => {
  if (!path || typeof path !== "string") {
    return "";
  }
  const parts = path.split("/");
  return parts[parts.length - 1];
};

export function EditContribution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);
  const [formDataDraft, setFormDataDraft] = useState({
    title: null,
    abstract: null,
    description: null,
    category_id: null,
  });
  const [files, setFiles] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);

  const { data, isPending, isError, error } = useContributionById(id);

  const contribution = data?.data;
  const { data: catsRes } = useCategories();
  const categoryType = useMemo(() => {
    const allCategories = catsRes?.data ?? [];
    if (!contribution?.category_id || allCategories.length === 0) return null;
    const matched = allCategories.find((cat) => cat.id === contribution.category_id);
    return matched?.type ?? null;
  }, [contribution?.category_id, catsRes?.data]);

const contributionType =
  categoryType === "gallery" ? "photography" : "article";

  const finalClosureDateText = contribution?.academic_year?.final_closure_date ?? null;
  const isAfterFinalClosureDate = useMemo(() => {
    if (!finalClosureDateText) return false;
    const finalClosureDate = new Date(`${finalClosureDateText}T23:59:59`);
    if (Number.isNaN(finalClosureDate.getTime())) return false;
    return new Date() > finalClosureDate;
  }, [finalClosureDateText]);

  const existingDescription = contribution?.description ?? "";
  const formData = {
    title: formDataDraft.title ?? contribution?.title ?? "",
    abstract: formDataDraft.abstract ?? existingDescription,
    description: formDataDraft.description ?? existingDescription,
    category_id:
      formDataDraft.category_id ??
      (contribution?.category_id ? String(contribution.category_id) : ""),
  };
  const existingFileName = getFileNameFromPath(contribution?.file_path);

  const { mutate: updateContribution, isPending: isUpdating } = useUpdateContribution(
    () => {
      const listPath = `/student/my-contributions${location.search || ""}`;
      navigate(listPath);
    },
  );

  const textBodyFilled =
    contributionType === "article" ? formData.abstract : formData.description;
  const canProceedStep1 = formData.title && textBodyFilled && formData.category_id;

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const resolvedDescription =
      contributionType === "article" ? formData.abstract : formData.description;

    updateContribution({
      id,
      data: {
        title: formData.title,
        description: resolvedDescription,
        category_id: formData.category_id,
        file: files[0],
        cover_photo: coverPhoto,
      },
    });
  };

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#f8f9fb] dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[#64748b] dark:text-slate-400">
            <Spinner size="sm" />
            <p>Loading contribution...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !contribution) {
    return (
      <main className="min-h-screen bg-[#f8f9fb] dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-3 py-10 sm:px-6 lg:px-8">
          <Card shadow="none" className="border border-[#fecaca] dark:border-red-900/50 bg-white dark:bg-slate-800" radius="lg">
            <CardBody>
              <h2 className="text-lg font-semibold text-[#b91c1c] dark:text-red-400">Unable to load contribution</h2>
              <p className="mt-2 text-sm text-[#7f1d1d] dark:text-red-300">
                {error?.response?.data?.message || "Contribution not found or you do not have access."}
              </p>
              <div className="mt-4">
                <Button
                  color="primary"
                  className="bg-[#1e3a5f] text-[#ffffff]"
                  onPress={() => navigate(`/student/my-contributions${location.search || ""}`)}
                >
                  Back to My Contributions
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fb] dark:bg-slate-900">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a2e] dark:text-white">
            Edit Contribution
          </h1>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-[#64748b] dark:text-slate-400 leading-relaxed">
            Update your contribution details and file before final closure.
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {currentStep === 1 && (
          <DetailsForm
            contributionType={contributionType}
            formData={formData}
            onFormDataChange={(updated) =>
              setFormDataDraft((prev) => ({ ...prev, ...updated }))
            }
            coverPhoto={coverPhoto}
            onCoverPhotoChange={setCoverPhoto}
            initialCoverPhotoUrl={contribution.cover_photo_url || null}
            initialCoverPhotoName={getFileNameFromPath(contribution.cover_photo_path) || "Current cover photo"}
            allowCoverPhotoRemoval
          />
        )}

        {currentStep === 2 && (
          <UploadForm
            contributionType={contributionType}
            files={files}
            onFilesChange={setFiles}
            existingFileName={existingFileName}
            requireFile={false}
          />
        )}

        {isAfterFinalClosureDate && (
          <div className="my-6 flex items-start gap-3 rounded-xl border-l-4 border-[#dc2626] bg-[#fef2f2] dark:bg-red-900/20 px-4 py-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-[#dc2626] dark:text-red-400">
                Editing Is Closed
              </p>
              <p className="mt-0.5 text-xs text-[#b91c1c] dark:text-red-300">
                The final closure date (
                <span className="font-semibold">{finalClosureDateText}</span>) has
                passed. This contribution can no longer be edited.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 ? (
              <Button
                variant="bordered"
                onPress={handleBack}
                className="border-[#e2e8f0] dark:border-slate-600 text-[#1a1a2e] dark:text-white"
                radius="lg"
                size="md"
              >
                Back
              </Button>
            ) : (
              <Button
                variant="bordered"
                onPress={() => navigate(`/student/my-contributions${location.search || ""}`)}
                className="border-[#e2e8f0] dark:border-slate-600 text-[#1a1a2e] dark:text-white"
                radius="lg"
                size="md"
              >
                Cancel
              </Button>
            )}
          </div>
          <div>
            {currentStep < 2 ? (
              <Button
                color="primary"
                onPress={handleNext}
                isDisabled={!canProceedStep1 || isAfterFinalClosureDate}
                className="bg-[#1e3a5f] text-[#ffffff] text-xs sm:text-sm"
                radius="lg"
                size="md"
              >
                Continue to Upload
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={isUpdating || isAfterFinalClosureDate}
                isLoading={isUpdating}
                className="bg-[#1e3a5f] text-[#ffffff] text-xs sm:text-sm"
                radius="lg"
                size="md"
              >
                {isUpdating ? "Updating..." : "Save Changes"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
