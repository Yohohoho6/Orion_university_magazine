import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Stepper } from "./stepper";
import { TermsAndConditions } from "./TermsAndConditions";
import { DetailsForm } from "./DetailsForm";
import { UploadForm } from "./UploadForm";
import { ContributionTypeCard } from "./ContributionTypeCard";
import { HiCamera } from "react-icons/hi";
import { LuFileText } from "react-icons/lu";
import { useStoreContribution } from "../hooks/useStoreContribution";
import { useAcademicYears } from "../hooks/useAcademicYears";

const steps = [
  { number: 1, label: "Type & Terms" },
  { number: 2, label: "Details" },
  { number: 3, label: "Upload" },
];

export function SubmitContribution() {
  const [currentStep, setCurrentStep] = useState(1);
  const [contributionType, setContributionType] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    description: "",
    category_id: "",
  });
  const [files, setFiles] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const { data: yearsRes } = useAcademicYears();
  const academicYears = yearsRes?.data ?? [];
  const activeAcademicYear =
    academicYears.find((year) => year.is_active) ?? academicYears[0];

  const closureDateText = activeAcademicYear?.closure_date ?? null;
  const isAfterClosureDate = (() => {
    if (!closureDateText) return false;
    const closureDate = new Date(`${closureDateText}T23:59:59`);
    if (Number.isNaN(closureDate.getTime())) return false;
    const now = new Date();
    return now > closureDate;
  })();

  const { mutate: storeContribution, isPending } = useStoreContribution(() => {
    setCurrentStep(1);
    setContributionType(null);
    setIsAgreed(false);
    setFormData({
      title: "",
      abstract: "",
      description: "",
      category_id: "",
    });
    setFiles([]);
    setCoverPhoto(null);
  });

  const canProceedStep1 = contributionType && isAgreed && !isAfterClosureDate;
  const textBodyFilled =
    contributionType === "article" ? formData.abstract : formData.description;
  const canProceedStep2 =
    formData.title &&
    textBodyFilled &&
    formData.category_id;

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const resolvedDescription =
      contributionType === "article" ? formData.abstract : formData.description;
    storeContribution({
      title: formData.title,
      abstract: formData.abstract,
      description: resolvedDescription,
      category_id: formData.category_id,
      terms_accepted: true,
      file: files[0],
      cover_photo: coverPhoto,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Submit New Contribution
          </h1>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Submit your article or photography for the 2025-2026 university magazine
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-6 sm:mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Step 1: Type & Terms */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4 sm:gap-6">
            <Card
              shadow="none"
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              radius="lg"
            >
              <CardBody className="p-4 sm:p-6">
                <h2 className="mb-4 sm:mb-5 text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  Select Contribution Type
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2">
                  <ContributionTypeCard
                    icon={
                      <LuFileText className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 dark:text-blue-400" />
                    }
                    title="Article"
                    description="Submit research papers, projects, creative writing, or reviews"
                    bullets={[
                      "Word document required",
                      "Include title & abstract",
                    ]}
                    isSelected={contributionType === "article"}
                    onSelect={() => setContributionType("article")}
                  />
                  <ContributionTypeCard
                    icon={
                      <HiCamera className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500 dark:text-blue-400" />
                    }
                    title="Photography"
                    description="Submit high-quality images and photographs"
                    bullets={[
                      "High quality image required",
                      "Image caption & title",
                    ]}
                    isSelected={contributionType === "photography"}
                    onSelect={() => setContributionType("photography")}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Terms and Conditions */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                contributionType
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-2 pointer-events-none h-0 overflow-hidden"
              }`}
            >
              {!isAfterClosureDate && (
                <TermsAndConditions
                  isAgreed={isAgreed}
                  onAgreeChange={setIsAgreed}
                />
              )}
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {currentStep === 2 && (
          <DetailsForm
            contributionType={contributionType}
            formData={formData}
            onFormDataChange={(data) =>
              setFormData((prev) => ({ ...prev, ...data }))
            }
            coverPhoto={coverPhoto}
            onCoverPhotoChange={setCoverPhoto}
          />
        )}

        {/* Step 3: Upload */}
        {currentStep === 3 && (
          <UploadForm
            contributionType={contributionType}
            files={files}
            onFilesChange={setFiles}
          />
        )}

        {/* Closure Banner */}
        {currentStep === 1 && isAfterClosureDate && (
          <div className="my-6 flex items-start gap-3 rounded-xl border-l-4 border-red-600 dark:border-red-500 bg-red-50 dark:bg-red-950/40 px-4 py-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                Submissions Are Closed
              </p>
              <p className="mt-0.5 text-xs text-red-700 dark:text-red-300">
                The closure date (
                <span className="font-semibold">{closureDateText}</span>) has
                passed. No new contributions can be accepted.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
          <div>
            {currentStep > 1 && (
              <Button
                variant="bordered"
                onPress={handleBack}
                className="border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-transparent dark:hover:bg-gray-700"
                radius="lg"
                size="md"
              >
                Back
              </Button>
            )}
          </div>
          <div>
            {currentStep < 3 ? (
              <Button
                color="primary"
                onPress={handleNext}
                isDisabled={
                  currentStep === 1 ? !canProceedStep1 : !canProceedStep2
                }
                className="bg-blue-900 dark:bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-800 dark:hover:bg-blue-500"
                radius="lg"
                size="md"
              >
                {currentStep === 1
                  ? "Continue to Details"
                  : "Continue to Upload"}
              </Button>
            ) : (
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={files.length === 0 || isPending}
                isLoading={isPending}
                className="bg-blue-900 dark:bg-blue-600 text-white text-xs sm:text-sm hover:bg-blue-800 dark:hover:bg-blue-500"
                radius="lg"
                size="md"
              >
                {isPending ? "Submitting..." : "Submit Contribution"}
              </Button>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}