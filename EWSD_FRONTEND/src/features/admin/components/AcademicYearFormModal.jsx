import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import {
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from "../hooks/useAcademicYears";
import { LuCalendarDays } from "react-icons/lu";
import { useEffect } from "react";

export const AcademicYearFormModal = ({
  isOpen,
  onClose,
  academicYear = null,
}) => {
  const isEditMode = !!academicYear;

  const {
    handleSubmit,
    register,
    reset,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      start_date: "",
      end_date: "",
      closure_date: "",
      final_closure_date: "",
    },
    mode: "onChange",
  });

  // Simple date compare (safe for YYYY-MM-DD format)
  const isAfter = (a, b) => a > b;
  const isBefore = (a, b) => a < b;

  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const closureDate = watch("closure_date");

  // Revalidate dependent fields automatically
  useEffect(() => {
    if (startDate) trigger(["end_date", "closure_date"]);
  }, [startDate, trigger]);

  useEffect(() => {
    if (endDate) trigger(["closure_date", "final_closure_date"]);
  }, [endDate, trigger]);

  useEffect(() => {
    if (closureDate) trigger("final_closure_date");
  }, [closureDate, trigger]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && academicYear) {
      reset({
        name: academicYear.name || "",
        start_date: academicYear.start_date?.split("T")[0] || "",
        end_date: academicYear.end_date?.split("T")[0] || "",
        closure_date: academicYear.closure_date?.split("T")[0] || "",
        final_closure_date:
          academicYear.final_closure_date?.split("T")[0] || "",
      });
    } else {
      reset();
    }
  }, [isEditMode, academicYear, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const {
    mutate: createAcademicYear,
    isPending: isCreating,
  } = useCreateAcademicYear(handleClose);

  const {
    mutate: updateAcademicYear,
    isPending: isUpdating,
  } = useUpdateAcademicYear(handleClose);

  const isPending = isCreating || isUpdating;

  const onSubmit = (payload) => {
    console.log(payload);
    if (isEditMode) {
      updateAcademicYear({ id: academicYear.id, ...payload });
    } else {
      createAcademicYear(payload);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            {isEditMode ? "Edit Academic Year" : "Create Academic Year"}
          </ModalHeader>

          <ModalBody className="gap-4">
            {/* Name */}
            <Input
              label="Name"
              labelPlacement="outside"
              placeholder="e.g. 2025-2026"
              startContent={
                <LuCalendarDays size={18} className="text-gray-500" />
              }
              isInvalid={!!errors.name}
              errorMessage={
                errors.name?.message
              }
              {...register("name", {
                required: "Name is required",
              })}
            />

            {/* Start Date */}
            <Input
              type="date"
              label="Start Date"
              labelPlacement="outside"
              isInvalid={!!errors.start_date}
              errorMessage={
                errors.start_date?.message
              }
              {...register("start_date", {
                required: "Start date is required",
              })}
            />

            {/* End Date */}
            <Input
              type="date"
              label="End Date"
              labelPlacement="outside"
              isInvalid={!!errors.end_date}
              errorMessage={
                errors.end_date?.message
              }
              {...register("end_date", {
                required: "End date is required",
                validate: (value) => {
                  const start = getValues("start_date");
                  if (!start || !value) return true;

                  return (
                    isAfter(value, start) ||
                    "End date must be after start date"
                  );
                },
              })}
            />

            {/* Closure Date */}
            <Input
              type="date"
              label="Closure Date"
              labelPlacement="outside"
              isInvalid={!!errors.closure_date}
              errorMessage={
                errors.closure_date?.message
              }
              {...register("closure_date", {
                required: "Closure date is required",
                validate: (value) => {
                  const start = getValues("start_date");
                  const end = getValues("end_date");

                  if (!value) return true;

                  if (start && !isAfter(value, start))
                    return "Closure must be after start date";

                  if (end && !isBefore(value, end))
                    return "Closure must be before end date";

                  return true;
                },
              })}
            />

            {/* Final Closure Date */}
            <Input
              type="date"
              label="Final Closure Date"
              labelPlacement="outside"
              isInvalid={
                !!errors.final_closure_date
              }
              errorMessage={
                errors.final_closure_date?.message
              }
              {...register("final_closure_date", {
                required: "Final closure date is required",
                validate: (value) => {
                  const closure = getValues("closure_date");
                  const end = getValues("end_date");

                  if (!value) return true;

                  if (closure && !isAfter(value, closure))
                    return "Final closure must be after closure date";

                  if (end && !isBefore(value, end))
                    return "Final closure must be before end date";

                  return true;
                },
              })}
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={handleClose}>
              Cancel
            </Button>

            <Button
              className="bg-linear-to-r from-[#1e3a8a] to-[#1e3a8a] text-white"
              type="submit"
              isLoading={isPending}
              disabled={isPending}
            >
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create Academic Year"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};