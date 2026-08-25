import { z } from "zod";

const mobileRegex = /^\d{10}$/;
const aadharRegex = /^\d{12}$/;
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
    id: z.union([z.number(), z.string()]).optional(),
    docId: z.union([z.number(), z.string()]).optional(),
    docName: z.string().optional().default(""),
    docType: z.string().optional(),
    fileBuffer: z.any().optional(),
    file: z.any().nullable().optional(),
  })
).refine((docs) => {
  return docs && docs.length > 0 && docs.every(doc => doc.file !== null && doc.file !== undefined && doc.file !== "");
}, {
  message: "All documents are compulsory. Please upload all required documents.",
});

export const propertyTransferSearchSchema = z.object({
  ptn: z.string()
    .min(1, "Please enter Property Number")
    .default("")
    .refine((val) => val && val.trim() !== "", "Please enter Property Number"),
  subcode: z.string().optional().default(""),
});

export const propertyTransferApplicantSchema = z.object({
  newOwnerName: z.string()
    .min(1, "Please enter Owner Name")
    .default("")
    .refine((val) => val && val.trim() !== "", "Please enter Owner Name"),
  emailId: z.string()
    .min(1, "Please enter Email ID")
    .regex(emailRegex, "Invalid Email Address")
    .default("")
    .refine((val) => val && val.trim() !== "", "Please enter Email ID"),
  newAddress: z.string()
    .min(1, "Please enter Address")
    .default("")
    .refine((val) => val && val.trim() !== "", "Please enter Address"),
  mobileNo: z.string()
    .min(1, "Please enter Mobile Number")
    .regex(mobileRegex, "Mobile Number must be 10 digits")
    .default("")
    .refine((val) => val && val.trim() !== "", "Please enter Mobile Number"),
  aadharNo: z.string()
    .optional()
    .default("")
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      return aadharRegex.test(val);
    }, "Aadhar Number must be 12 digits"),
  transferType: z.string()
    .min(1, "Please select Transfer Type")
    .default("")
    .refine((val) => val && val.trim() !== "", "Please select Transfer Type"),
});

export const propertyTransferDocumentValidationSchema = z.array(
  z.object({
    docId: z.union([z.string(), z.number()]).default(0),
    docName: z.string().default(""),
    docType: z.string().optional().default("PDF"),
    fileBuffer: z.any().optional(),
    file: z.any().nullable().optional(),
  })
).refine((docs) => {
  return docs && docs.length > 0 && docs.some(doc => doc.file !== null && doc.file !== undefined && doc.file !== "");
}, {
  message: "Please upload at least one document",
});

export const propertyRebateValidationSchema = z.object({
  applicantName: z.string()
    .min(1, "Applicant Name cannot be blank")
    .refine((val) => val && val.trim() !== "", "Applicant Name cannot be blank"),
  mobileNo: z.string()
    .min(1, "Mobile Number cannot be blank")
    .regex(mobileRegex, "Invalid Mobile Number"),
  emailId: z.string()
    .min(1, "Email ID cannot be blank")
    .regex(emailRegex, "Invalid Email Address"),
  aadharNo: z.string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      return aadharRegex.test(val);
    }, "Invalid Aadhar No"),
  pincode: z.string()
    .min(1, "Pincode cannot be blank")
    .regex(/^\d{6}$/, "Invalid Pincode"),
  rebateType: z.string()
    .refine((val) => {
      return true;
    }, "Please Select Rebate Type"),
  remark: z.string()
    .min(1, "Remark cannot be blank"),
  landHolder: z.string().optional(),
  structureHolder: z.string().optional(),
  ownerDetails: z.string().optional(),
  address: z.string().optional(),
});
