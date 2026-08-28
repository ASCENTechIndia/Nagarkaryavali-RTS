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
  zoneId: z.string()
    .min(1, "Please select a Zone")
    .refine((val) => val !== undefined && val !== null && val !== "" && val !== "0" && val !== "-1", {
      message: "Please select a Zone",
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
  zoneId: z.string()
    .min(1, "Please select a Zone")
    .refine((val) => val !== undefined && val !== null && val !== "" && val !== "0" && val !== "-1", {
      message: "Please select a Zone",
    }),
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
  zoneId: z.string()
    .min(1, "Please select a Zone")
    .refine((val) => val !== undefined && val !== null && val !== "" && val !== "0" && val !== "-1", {
      message: "Please select a Zone",
    }),
});


export const serviceApplicationValidationSchema = (
  serviceId,
) =>
  z
    .object({
      appName: z
        .string()
        .trim()
        .min(
          1,
          "Please Enter Application Name",
        ),

      address: z
        .string()
        .optional()
        .default(""),

      mobile: z
        .string()
        .trim()
        .min(
          1,
          "Please Enter Mobile No",
        )
        .regex(
          mobileRegex,
          "Mobile Number must be 10 digits",
        ),



      aadharNo: z
        .string()
        .optional()
        .default("")
        .refine(
          (value) => {
            if (!value?.trim()) {
              return true;
            }

            return aadharRegex.test(
              value.trim(),
            );
          },
          {
            message:
              "Aadhar Number must be 12 digits",
          },
        ),

      refNo: z
        .string()
        .optional()
        .default(""),

      zoneId: z
        .string()
        .optional()
        .default(""),

      sectorId: z
        .string()
        .optional()
        .default(""),

      villageId: z
        .string()
        .optional()
        .default(""),

      locality: z
        .string()
        .optional()
        .default(""),

      landmark: z
        .string()
        .optional()
        .default(""),

      pincode: z
        .string()
        .optional()
        .default(""),

      documents: documentValidationSchema,
    })
    .superRefine((values, ctx) => {
      const isSectorService = [
        "60",
        "62",
      ].includes(String(serviceId));

      const isAddressService = [
        "41",
        "461",
      ].includes(String(serviceId));

      /*
       * Service 60 / 62
       * Sector + Village required
       */
      if (isSectorService) {
        if (
          !values.sectorId ||
          values.sectorId === "0" ||
          values.sectorId === "-1"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sectorId"],
            message:
              "Please select Sector",
          });
        }

        if (
          !values.villageId ||
          values.villageId === "0" ||
          values.villageId === "-1"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["villageId"],
            message:
              "Please select Village",
          });
        }
      } else {
        /*
         * Other services
         * Prabhag required
         */
        if (
          !values.zoneId ||
          values.zoneId === "0" ||
          values.zoneId === "-1"
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["zoneId"],
            message:
              "Please select Prabhag",
          });
        }
      }

      /*
       * Service 41 / 461
       * Address + Locality + Landmark + Pincode
       */
      if (isAddressService) {
        if (!values.address?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message:
              "Please Enter Address",
          });
        }

        if (!values.locality?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["locality"],
            message:
              "Please Enter Locality",
          });
        }

        if (!values.landmark?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["landmark"],
            message:
              "Please Enter LandMark",
          });
        }

        if (!values.pincode?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pincode"],
            message:
              "Please Enter Pincode",
          });
        } else if (
          !/^\d{6}$/.test(
            values.pincode,
          )
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["pincode"],
            message:
              "Invalid Pincode",
          });
        }
      }
    });