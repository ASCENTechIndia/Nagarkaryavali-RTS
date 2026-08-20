import { z } from "zod";

const mobileRegex = /^\d{10}$/;
const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;

export const propertySearchValidationSchema = z.object({
  ptn: z.string()
    .min(1, "Property Number is required")
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Please enter Property Number",
    }),
  subcode: z.string().optional(),
});

export const applicantDetailsValidationSchema = z.object({
  applicantName: z.string()
    .min(1, "Applicant Name is required")
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Please enter Applicant Name",
    }),
  mobileNo: z.string()
    .min(1, "Mobile Number is required")
    .regex(mobileRegex, "Mobile Number must be 10 digits")
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Please enter Mobile Number",
    }),
  emailId: z.string()
    .min(1, "Email ID is required")
    .regex(emailRegex, "Invalid Email Address")
    .refine((val) => val !== undefined && val !== null && val !== "", {
      message: "Please enter Email ID",
    }),
});

export const documentValidationSchema = z.array(
  z.object({
    docId: z.number(),
    docName: z.string(),
    docType: z.string(),
    fileBuffer: z.any().optional(),
  })
).min(1, "Please upload at least one document");