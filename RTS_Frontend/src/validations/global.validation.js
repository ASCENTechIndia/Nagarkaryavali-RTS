import { z } from "zod";

const mobileRegex = /^\d{10}$/;
const aadharRegex = /^\d{12}$/;
const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
const pincodeRegex = /^\d{6}$/;

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




export const commonValidationSchema = {
  mobile: z.string()
    .min(1, "Mobile Number is required")
    .regex(mobileRegex, "Mobile Number must be 10 digits"),

  // aadhar: z.string()
  //   .min(1, "Aadhar Card No is required")
  //   .regex(aadharRegex, "Aadhar Card No must be 12 digits"),

  // email: z.string()
  //   .min(1, "Email ID is required")
  //   .regex(emailRegex, "Invalid Email Address"),

  pincode: z.string()
    .min(1, "Pincode is required")
    .regex(pincodeRegex, "Invalid Pincode"),

  name: z.string()
    .min(1, "Name is required")
    .max(200, "Name cannot exceed 200 characters"),

  address: z.string()
    .min(1, "Address is required")
    .max(500, "Address cannot exceed 500 characters"),

  selectOption: z.string()
    .min(1, "Please select an option")
    .refine((val) => val !== "0" && val !== "-1" && val !== "", {
      message: "Please select a valid option",
    }),
};

export const createPersonValidationSchema = (personType) => {
  const prefix = personType === "priest" ? "Priest" : 
                  personType === "husband" ? "Husband" :
                  personType === "wife" ? "Wife" : "Witness";

  const requiresAadharEmail = personType === "husband" || personType === "wife";
  const requiresBeforeMarriageDocs = personType === "husband" || personType === "wife";
  
  return z.object({
    photo: z.any().nullable().optional(),
    photoPreview: z.string().optional(),
    thumb: z.any().nullable().optional(),
    thumbPreview: z.string().optional(),
    englishFirstName: z.string().min(1, `${prefix}: English First Name is required`),
    englishMiddleName: z.string().min(1, `${prefix}: English Middle Name is required`),
    englishLastName: z.string().min(1, `${prefix}: English Last Name is required`),
    marathiFirstName: z.string().min(1, `${prefix}: Marathi First Name is required`),
    marathiMiddleName: z.string().min(1, `${prefix}: Marathi Middle Name is required`),
    marathiLastName: z.string().min(1, `${prefix}: Marathi Last Name is required`),
    aadharNo: requiresAadharEmail 
      ? z.string().min(1, `${prefix}: Aadhar Card No is required`).regex(aadharRegex, `${prefix}: Aadhar Card No must be 12 digits`)
      : z.string().optional(),
    contact: commonValidationSchema.mobile,
    email: requiresAadharEmail
      ? z.string().min(1, `${prefix}: Email ID is required`).regex(emailRegex, `${prefix}: Invalid Email Address`)
      : z.string().optional(),
    birthDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
      .refine((val) => val !== null && val !== undefined && val !== "", {
        message: `${prefix}: Date of Birth is required`,
      }),
    age: z.string().optional(),
    documentType: z.string().optional(),
    documentNo: z.string().optional(),
    relation: z.string().optional(),
    maritalStatus: z.string().optional(),
    disability: z.string().optional(),
    birthReligion: z.string().optional(),
    adoptedReligion: z.string().optional(),
    englishAddress: commonValidationSchema.address,
    marathiAddress: commonValidationSchema.address,
    idDocument: requiresBeforeMarriageDocs
      ? z.string().min(1, `${prefix}: Please Select ID Document`)
      : z.string().optional(),
    idDocumentFile: requiresBeforeMarriageDocs
      ? z.any().nullable().optional()
      : z.any().nullable().optional(),
      
    addressDocument: requiresBeforeMarriageDocs
      ? z.string().min(1, `${prefix}: Please Select Address Document`)
      : z.string().optional(),
    addressDocumentFile: requiresBeforeMarriageDocs
      ? z.any().nullable().optional()
      : z.any().nullable().optional(),
      
    ageDocument: requiresBeforeMarriageDocs
      ? z.string().min(1, `${prefix}: Please Select Age Document`)
      : z.string().optional(),
    ageDocumentFile: requiresBeforeMarriageDocs
      ? z.any().nullable().optional()
      : z.any().nullable().optional(),
  });
};

export const priestValidationSchema = z.object({
  englishFirstName: z.string().min(1, "Priest: English First Name is required"),
  englishMiddleName: z.string().min(1, "Priest: English Middle Name is required"),
  englishLastName: z.string().min(1, "Priest: English Last Name is required"),
  marathiFirstName: z.string().min(1, "Priest: Marathi First Name is required"),
  marathiMiddleName: z.string().min(1, "Priest: Marathi Middle Name is required"),
  marathiLastName: z.string().min(1, "Priest: Marathi Last Name is required"),
  age: z.string()
    .min(1, "Priest: Age is required")
    .regex(/^\d+$/, "Priest: Age must be a valid number"),
  birthReligion: commonValidationSchema.selectOption,
  englishAddress: commonValidationSchema.address,
  marathiAddress: commonValidationSchema.address,
});

export const applicationValidationSchema = z.object({
  zone: commonValidationSchema.selectOption,
  applicantFirstName: commonValidationSchema.name,
  applicantMiddleName: commonValidationSchema.name,
  applicantLastName: commonValidationSchema.name,
  mobileNo: commonValidationSchema.mobile,
  address: commonValidationSchema.address,
  marriageDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Marriage Date is required",
    }),
  marriagePlaceEnglish: commonValidationSchema.address,
  marriagePlaceMarathi: commonValidationSchema.address,
  documents: z.array(
    z.object({
      id: z.union([z.number(), z.string()]).optional(),
      selected: z.boolean().optional(),
      documentType: z.string().optional(),
      file: z.any().nullable().optional(),
    })
  ).optional(),
});

export const documentGridValidationSchema = z.array(
  z.object({
    id: z.union([z.number(), z.string()]).optional(),
    selected: z.boolean().optional(),
    documentType: z.string().optional(),
    file: z.any().nullable().optional(),
  })
).refine((docs) => {
  if (!docs || docs.length === 0) return false;
  const selectedDocs = docs.filter(doc => doc.selected === true);
  if (selectedDocs.length === 0) return false;
  const allHaveFile = selectedDocs.every(doc => doc.file !== null && doc.file !== undefined);
  return allHaveFile;
}, {
  message: "Please select at least one document and upload the corresponding file.",
});

export const husbandAgeValidation = z.object({
  marriageDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Marriage Date is required to calculate age",
    }),
  birthDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Husband: Date of Birth is required",
    }),
}).refine((data) => {
  if (!data.marriageDate || !data.birthDate) return false;
  const marriage = new Date(data.marriageDate);
  const birth = new Date(data.birthDate);
  if (isNaN(marriage) || isNaN(birth)) return false;
  let age = marriage.getFullYear() - birth.getFullYear();
  const monthDiff = marriage.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && marriage.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 21;
}, {
  message: "Husband: Age must be 21 years or greater. Please enter a valid Date of Birth",
});

export const wifeAgeValidation = z.object({
  marriageDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Marriage Date is required to calculate age",
    }),
  birthDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
    .refine((val) => val !== null && val !== undefined && val !== "", {
      message: "Wife: Date of Birth is required",
    }),
}).refine((data) => {
  if (!data.marriageDate || !data.birthDate) return false;
  const marriage = new Date(data.marriageDate);
  const birth = new Date(data.birthDate);
  if (isNaN(marriage) || isNaN(birth)) return false;
  let age = marriage.getFullYear() - birth.getFullYear();
  const monthDiff = marriage.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && marriage.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 18;
}, {
  message: "Wife: Age must be 18 years or greater. Please enter a valid Date of Birth",
});

export const witnessAgeValidation = (witnessNumber) => {
  const prefix = `Witness ${witnessNumber}`;
  return z.object({
    marriageDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
      .refine((val) => val !== null && val !== undefined && val !== "", {
        message: "Marriage Date is required to calculate age",
      }),
    birthDate: z.union([z.string(), z.date(), z.null(), z.undefined()])
      .refine((val) => val !== null && val !== undefined && val !== "", {
        message: `${prefix}: Date of Birth is required`,
      }),
  }).refine((data) => {
    if (!data.marriageDate || !data.birthDate) return false;
    const marriage = new Date(data.marriageDate);
    const birth = new Date(data.birthDate);
    if (isNaN(marriage) || isNaN(birth)) return false;
    let age = marriage.getFullYear() - birth.getFullYear();
    const monthDiff = marriage.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && marriage.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 21;
  }, {
    message: `${prefix}: Age must be 21 years or greater. Please enter a valid Date of Birth`,
  });
};

export const marriageRegistrationSchema = z.object({
  application: applicationValidationSchema,
  husband: createPersonValidationSchema("husband"),
  wife: createPersonValidationSchema("wife"),
  witness1: createPersonValidationSchema("witness"),
  witness2: createPersonValidationSchema("witness"),
  witness3: createPersonValidationSchema("witness"),
  priest: priestValidationSchema,
})
.superRefine((data, ctx) => {
  const result = husbandAgeValidation.safeParse({
    marriageDate: data.application.marriageDate,
    birthDate: data.husband.birthDate,
  });
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["husband", "birthDate"],
      });
    });
  }
})
.superRefine((data, ctx) => {
  const result = wifeAgeValidation.safeParse({
    marriageDate: data.application.marriageDate,
    birthDate: data.wife.birthDate,
  });
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["wife", "birthDate"],
      });
    });
  }
})
.superRefine((data, ctx) => {
  const result = witnessAgeValidation(1).safeParse({
    marriageDate: data.application.marriageDate,
    birthDate: data.witness1.birthDate,
  });
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["witness1", "birthDate"],
      });
    });
  }
})
.superRefine((data, ctx) => {
  const result = witnessAgeValidation(2).safeParse({
    marriageDate: data.application.marriageDate,
    birthDate: data.witness2.birthDate,
  });
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["witness2", "birthDate"],
      });
    });
  }
})
.superRefine((data, ctx) => {
  const result = witnessAgeValidation(3).safeParse({
    marriageDate: data.application.marriageDate,
    birthDate: data.witness3.birthDate,
  });
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["witness3", "birthDate"],
      });
    });
  }
});


export const step0ValidationSchema = z.object({
  firstName: z.string()
    .min(1, "First Name can not be blank")
    .refine((val) => val && val.trim() !== "", "First Name can not be blank"),
  
  firstNameM: z.string()
    .min(1, "First Name in Marathi can not be blank")
    .refine((val) => val && val.trim() !== "", "First Name in Marathi can not be blank"),
  
  middleName: z.string()
    .min(1, "Middle Name can not be blank")
    .refine((val) => val && val.trim() !== "", "Middle Name can not be blank"),
  
  middleNameM: z.string()
    .min(1, "Middle Name in Marathi can not be blank")
    .refine((val) => val && val.trim() !== "", "Middle Name in Marathi can not be blank"),
  
  lastName: z.string()
    .min(1, "Last Name can not be blank")
    .refine((val) => val && val.trim() !== "", "Last Name can not be blank"),
  
  lastNameM: z.string()
    .min(1, "Last Name in Marathi can not be blank")
    .refine((val) => val && val.trim() !== "", "Last Name in Marathi can not be blank"),
  
  mobileNo: z.union([z.string(), z.number()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === null || val === "") return "";
      return String(val);
    })
    .refine((val) => {
      if (!val || val === "" || val === "0") return true;
      return /^\d{10}$/.test(val);
    }, "Invalid Mobile No. Mobile number must be 10 digits"),
  
  address: z.string()
    .min(1, "Address can not be blank")
    .refine((val) => val && val.trim() !== "", "Address can not be blank"),
  
  addressM: z.string()
    .min(1, "Address in Marathi can not be blank")
    .refine((val) => val && val.trim() !== "", "Address in Marathi can not be blank"),
  
  purpose: z.string()
    .min(1, "Purpose can not be blank")
    .refine((val) => val && val.trim() !== "", "Purpose can not be blank"),
  
  purposeM: z.string()
    .min(1, "Purpose in Marathi can not be blank")
    .refine((val) => val && val.trim() !== "", "Purpose in Marathi can not be blank"),
  
  zoneId: z.union([z.string(), z.number()])
    .transform((val) => String(val))
    .refine((val) => {
      if (!val || val === "" || val === "0" || val === "-1") return false;
      return true;
    }, "Please select a Zone"),
});



export const waterApplicationValidationSchema = z
  .object({
    zoneId: commonValidationSchema.selectOption,

    applicantFirstName: z
      .string()
      .trim()
      .min(1, "Applicant First Name is required"),

    applicantMiddleName: z
      .string()
      .trim()
      .min(1, "Applicant Middle Name is required"),

    applicantLastName: z
      .string()
      .trim()
      .min(1, "Applicant Last Name is required"),

    mobileNumber: commonValidationSchema.mobile,

    email: z
      .string()
      .trim()
      .min(1, "Email ID is required")
      .regex(emailRegex, "Invalid Email Address"),

    aadharCardNo: z
      .string()
      .trim()
      .min(1, "Aadhar Card Number is required")
      .regex(aadharRegex, "Aadhar Card Number must be 12 digits"),

    propertyNumber: z
      .string()
      .trim()
      .min(1, "Property Number is required"),

    residentialNumber: z
      .string()
      .trim()
      .min(1, "Residential Number is required"),

    address: z
      .string()
      .trim()
      .min(1, "Address is required"),

    applicantFirstNameMarathi: z
      .string()
      .trim()
      .min(1, "Applicant First Name in Marathi is required"),

    applicantMiddleNameMarathi: z
      .string()
      .trim()
      .min(1, "Applicant Middle Name in Marathi is required"),

    applicantLastNameMarathi: z
      .string()
      .trim()
      .min(1, "Applicant Last Name in Marathi is required"),

    addressMarathi: z
      .string()
      .trim()
      .min(1, "Address in Marathi is required"),

    consumerFirstName: z
      .string()
      .trim()
      .min(1, "Consumer First Name is required"),

    consumerMiddleName: z
      .string()
      .trim()
      .min(1, "Consumer Middle Name is required"),

    consumerLastName: z
      .string()
      .trim()
      .min(1, "Consumer Last Name is required"),

    consumerMobileNumber: z
      .string()
      .trim()
      .min(1, "Consumer Mobile Number is required")
      .regex(mobileRegex, "Consumer Mobile Number must be 10 digits"),

    consumerEmail: z
      .string()
      .trim()
      .min(1, "Consumer Email ID is required")
      .regex(emailRegex, "Invalid Consumer Email Address"),

    consumerAadharCardNo: z
      .string()
      .trim()
      .min(1, "Consumer Aadhar Card Number is required")
      .regex(
        aadharRegex,
        "Consumer Aadhar Card Number must be 12 digits",
      ),

    consumerPropertyNumber: z
      .string()
      .trim()
      .min(1, "Consumer Property Number is required"),

    consumerResidentialNumber: z
      .string()
      .trim()
      .min(1, "Consumer Residential Number is required"),

    consumerFirstNameMarathi: z
      .string()
      .trim()
      .min(1, "Consumer First Name in Marathi is required"),

    consumerMiddleNameMarathi: z
      .string()
      .trim()
      .min(1, "Consumer Middle Name in Marathi is required"),

    consumerLastNameMarathi: z
      .string()
      .trim()
      .min(1, "Consumer Last Name in Marathi is required"),

    includeCoOwner: z
      .string()
      .min(1, "Please select whether Co-Owner details are required")
      .refine(
        (value) => ["Yes", "No"].includes(value),
        "Please select Yes or No",
      ),

    coOwnerFirstName: z.string().optional().default(""),

    coOwnerMiddleName: z.string().optional().default(""),

    coOwnerLastName: z.string().optional().default(""),

    coOwnerFirstNameMarathi: z.string().optional().default(""),

    coOwnerMiddleNameMarathi: z.string().optional().default(""),

    coOwnerLastNameMarathi: z.string().optional().default(""),

    coOwnerAddress: z.string().optional().default(""),

    coOwnerAddressMarathi: z.string().optional().default(""),

    connectionType: commonValidationSchema.selectOption,

    connectionSize: commonValidationSchema.selectOption,

    usageType: commonValidationSchema.selectOption,

    usageSubType: commonValidationSchema.selectOption,

    noOfPerson: z
      .union([z.string(), z.number()])
      .transform((value) => String(value))
      .refine(
        (value) =>
          value.trim() !== "" &&
          /^\d+$/.test(value) &&
          Number(value) > 0,
        "Number of Person must be greater than 0",
      ),

    noOfFamily: z
      .union([z.string(), z.number()])
      .transform((value) => String(value))
      .refine(
        (value) =>
          value.trim() !== "" &&
          /^\d+$/.test(value) &&
          Number(value) > 0,
        "Number of Family must be greater than 0",
      ),

    noOfConnection: z
      .union([z.string(), z.number()])
      .transform((value) => String(value))
      .refine(
        (value) =>
          value.trim() !== "" &&
          /^\d+$/.test(value) &&
          Number(value) > 0,
        "Number of Connection must be greater than 0",
      ),

    connectionStatus: commonValidationSchema.selectOption,

    businessCertificate: commonValidationSchema.selectOption,

    billingType: z
      .string()
      .trim()
      .min(1, "Billing Type is required"),

    isGovtProperty: z
      .string()
      .min(1, "Please select Government Property status")
      .refine(
        (value) => ["Yes", "No"].includes(value),
        "Please select Yes or No",
      ),

    remark: z
      .string()
      .trim()
      .min(1, "Remark is required"),

    reason: z
      .string()
      .trim()
      .min(1, "Reason is required"),
  })
  .superRefine((values, ctx) => {
    if (values.includeCoOwner === "Yes") {
      if (!values.coOwnerFirstName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerFirstName"],
          message: "Co-Owner First Name is required",
        });
      }

      if (!values.coOwnerMiddleName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerMiddleName"],
          message: "Co-Owner Middle Name is required",
        });
      }

      if (!values.coOwnerLastName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerLastName"],
          message: "Co-Owner Last Name is required",
        });
      }

      if (!values.coOwnerFirstNameMarathi?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerFirstNameMarathi"],
          message: "Co-Owner First Name in Marathi is required",
        });
      }

      if (!values.coOwnerMiddleNameMarathi?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerMiddleNameMarathi"],
          message: "Co-Owner Middle Name in Marathi is required",
        });
      }

      if (!values.coOwnerLastNameMarathi?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerLastNameMarathi"],
          message: "Co-Owner Last Name in Marathi is required",
        });
      }

      if (!values.coOwnerAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerAddress"],
          message: "Co-Owner Address is required",
        });
      }

      if (!values.coOwnerAddressMarathi?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["coOwnerAddressMarathi"],
          message: "Co-Owner Address in Marathi is required",
        });
      }
    }
  });