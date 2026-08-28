import { useState } from "react";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { DatePicker } from "@/components/ui/calendar";
import ShadCNTable from "@/components/ui/table";



const emptyPerson = {
  photo: null,
  photoPreview: "",
  thumb: null,
  thumbPreview: "",

  englishFirstName: "",
  englishMiddleName: "",
  englishLastName: "",

  marathiFirstName: "",
  marathiMiddleName: "",
  marathiLastName: "",

  aadharNo: "",
  contact: "",
  email: "",

  birthDate: null,
  age: "",

  documentType: "",
  documentNo: "",
  relation: "",

  maritalStatus: "",
  disability: "",
  birthReligion: "",
  adoptedReligion: "",

  englishAddress: "",
  marathiAddress: "",

  idDocument: "",
  idDocumentFile: null,

  addressDocument: "",
  addressDocumentFile: null,

  ageDocument: "",
  ageDocumentFile: null,
};

const initialValues = {
  application: {
    zone: "",
    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
    mobileNo: "",
    address: "",
    marriageDate: null,
    marriagePlaceEnglish: "",
    marriagePlaceMarathi: "",
    documents: [
      { id: 1, selected: false, documentType: "जन्म दाखला / शाळा सोडल्याचा दाखला / १० वी चे पासिंग Certificate", file: null },
      { id: 2, selected: false, documentType: "आधार कार्ड, Pan Card", file: null },
      { id: 3, selected: false, documentType: "लाईट बिल / रेशनकार्ड / इलेक्शन कार्ड / पासपोर्ट", file: null },
      { id: 4, selected: false, documentType: "लग्न विधीचे फोटो", file: null },
      { id: 5, selected: false, documentType: "लग्न पत्रिका", file: null },
      { id: 6, selected: false, documentType: "तीन साक्षीदार यांचे आधार कार्ड, लाईट बिल, दोन्ही फोटो व पंडित यांचे आधारकार्ड", file: null },
    ],
  },

  husband: {
    ...emptyPerson,
  },

  wife: {
    ...emptyPerson,
  },

  witness1: {
    ...emptyPerson,
  },

  witness2: {
    ...emptyPerson,
  },

  witness3: {
    ...emptyPerson,
  },

  priest: {
    ...emptyPerson,
  },
};

const tabs = [
  {
    value: "application",
    label: "Application Entry",
  },
  {
    value: "husband",
    label: "Husband Details",
    title: "वराची माहिती",
    photoLabel: "वराचे छायाचित्र",
    thumbLabel: "वराचा अंगठा",
  },
  {
    value: "wife",
    label: "Wife Details",
    title: "वधूची माहिती",
    photoLabel: "वधूचे छायाचित्र",
    thumbLabel: "वधूचा अंगठा",
  },
  {
    value: "witness1",
    label: "Witness1 Details",
    title: "प्रथम साक्षीदाराची माहिती",
    photoLabel: "फोटो",
    thumbLabel: "अंगठा",
  },
  {
    value: "witness2",
    label: "Witness2 Details",
    title: "दुसऱ्या साक्षीदाराची माहिती",
    photoLabel: "फोटो",
    thumbLabel: "अंगठा",
  },
  {
    value: "witness3",
    label: "Witness3 Details",
    title: "तिसरा साक्षीदाराची माहिती",
    photoLabel: "फोटो",
    thumbLabel: "अंगठा",
  },
  {
    value: "priest",
    label: "Priest Details",
    title: "पुरोहित/निबंधक माहिती",
    photoLabel: "फोटो",
    thumbLabel: "अंगठा",
  },
];

const zoneOptions = [
  { value: "1", label: "Zone 1" },
  { value: "2", label: "Zone 2" },
  { value: "3", label: "Zone 3" },
  { value: "4", label: "Zone 4" },
];

const relationOptions = [
  {
    value: "1",
    label: "पती",
  },
  {
    value: "2",
    label: "पत्नी",
  },
  {
    value: "3",
    label: "वडील",
  },
  {
    value: "4",
    label: "आई",
  },
  {
    value: "5",
    label: "भाऊ",
  },
  {
    value: "6",
    label: "बहीण",
  },
  {
    value: "7",
    label: "इतर",
  },
];

const documentOptions = [
  {
    value: "1",
    label: "Aadhar Card",
  },
  {
    value: "2",
    label: "Voter ID",
  },
  {
    value: "3",
    label: "Driving License",
  },
  {
    value: "4",
    label: "Passport",
  },
];

const maritalStatusOptions = [
  {
    value: "1",
    label: "अविवाहित",
  },
  {
    value: "2",
    label: "विवाहित",
  },
  {
    value: "3",
    label: "विधुर",
  },
  {
    value: "4",
    label: "विधवा",
  },
];

const religionOptions = [
  {
    value: "1",
    label: "हिंदू",
  },
  {
    value: "2",
    label: "मुस्लिम",
  },
  {
    value: "3",
    label: "ख्रिश्चन",
  },
  {
    value: "4",
    label: "बौद्ध",
  },
  {
    value: "5",
    label: "जैन",
  },
  {
    value: "6",
    label: "इतर",
  },
];

const disabilityOptions = [
  {
    value: "Y",
    label: "होय",
  },
  {
    value: "N",
    label: "नाही",
  },
];

function FrmMarriageRgstn() {
  const [activeTab, setActiveTab] = useState("application");

  const [formInitialValues] = useState(initialValues);

  const handleFile = (
    setFieldValue,
    path,
    previewPath,
    file
  ) => {
    setFieldValue(path, file || null);

    if (!file) {
      setFieldValue(previewPath, "");
      return;
    }

    const preview = URL.createObjectURL(file);
    setFieldValue(previewPath, preview);
  };

  const validatePerson = (person, personName) => {
    if (!person) {
      return `${personName} information is required.`;
    }

    const isPriest = personName === "Priest";

    if (!isPriest && !person.photo) {
      return `${personName}: Please upload photo.`;
    }

    if (!isPriest && !person.thumb) {
      return `${personName}: Please upload thumb impression.`;
    }

    if (!person.englishFirstName?.trim()) {
      return `${personName}: English First Name is required.`;
    }

    if (!person.englishMiddleName?.trim()) {
      return `${personName}: English Middle Name is required.`;
    }

    if (!person.englishLastName?.trim()) {
      return `${personName}: English Last Name is required.`;
    }

    if (!person.marathiFirstName?.trim()) {
      return `${personName}: Marathi First Name is required.`;
    }

    if (!person.marathiMiddleName?.trim()) {
      return `${personName}: Marathi Middle Name is required.`;
    }

    if (!person.marathiLastName?.trim()) {
      return `${personName}: Marathi Last Name is required.`;
    }

    if (!person.aadharNo?.trim()) {
      return `${personName}: Aadhar Card No is required.`;
    }

    if (person.aadharNo.length !== 12) {
      return `${personName}: Aadhar Card No must be 12 digits.`;
    }

    if (!person.contact?.trim()) {
      return `${personName}: Mobile Number is required.`;
    }

    if (person.contact.length !== 10) {
      return `${personName}: Mobile Number must be 10 digits.`;
    }

    if (isPriest) {
      if (!person.age?.trim()) {
        return `${personName}: Age is required.`;
      }

      if (!person.birthReligion) {
        return `${personName}: Religion is required.`;
      }
    } else if (!person.birthDate) {
      return `${personName}: Date of Birth is required.`;
    }

    if (!person.englishAddress?.trim()) {
      return `${personName}: English Address is required.`;
    }

    if (!person.marathiAddress?.trim()) {
      return `${personName}: Marathi Address is required.`;
    }

    return null;
  };

  const validateAll = (values) => {
    const application = values.application;

    if (!application.zone) {
      return {
        tab: "application",
        message: "Zone is required.",
      };
    }

    if (!application.applicantFirstName?.trim()) {
      return {
        tab: "application",
        message: "Applicant First Name is required.",
      };
    }

    if (!application.applicantMiddleName?.trim()) {
      return {
        tab: "application",
        message: "Applicant Middle Name is required.",
      };
    }

    if (!application.applicantLastName?.trim()) {
      return {
        tab: "application",
        message: "Applicant Last Name is required.",
      };
    }

    if (!application.mobileNo?.trim()) {
      return {
        tab: "application",
        message: "Mobile No is required.",
      };
    }

    if (application.mobileNo.length !== 10) {
      return {
        tab: "application",
        message: "Mobile No must be 10 digits.",
      };
    }

    if (!application.address?.trim()) {
      return {
        tab: "application",
        message: "Address is required.",
      };
    }

    if (!application.marriageDate) {
      return {
        tab: "application",
        message: "Marriage Date is required.",
      };
    }

    if (!application.marriagePlaceEnglish?.trim()) {
      return {
        tab: "application",
        message: "Marriage Place English is required.",
      };
    }

    if (!application.marriagePlaceMarathi?.trim()) {
      return {
        tab: "application",
        message: "Marriage Place Marathi is required.",
      };
    }

    const people = [
      { key: "husband", name: "Husband" },
      { key: "wife", name: "Wife" },
      { key: "witness1", name: "Witness 1" },
      { key: "witness2", name: "Witness 2" },
      { key: "witness3", name: "Witness 3" },
      { key: "priest", name: "Priest" },
    ];

    for (const person of people) {
      const error = validatePerson(values[person.key], person.name);

      if (error) {
        return {
          tab: person.key,
          message: error,
        };
      }
    }

    return null;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const validationError = validateAll(values);

    if (validationError) {
      setActiveTab(validationError.tab);

      await Swal.fire({
        icon: "warning",
        title: "Required Information",
        text: validationError.message,
        
      });

      setSubmitting(false);
      return;
    }

    console.log("Marriage Registration Values:", values);

    await Swal.fire({
      icon: "success",
      title: "Validation Successful",
      text: "All required information has been entered.",
      
    });

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 p-3 md:p-5">
      <div className="mx-auto w-full max-w-[1600px] rounded-md border border-slate-300 bg-white shadow-sm">
        {/* PAGE TITLE */}
        <div className="border-b border-slate-200 px-5 py-4">
          <h1
            className="text-lg font-semibold"
           
          >
            Marriage Registration
          </h1>
        </div>

        <Formik
          initialValues={formInitialValues}
          onSubmit={handleSubmit}
        >
          {({
            values,
            setFieldValue,
            isSubmitting,
          }) => {
            return (
              <Form className="w-full">
                <div className="p-4 md:p-5">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    {/* TAB HEADER */}
                    <div className="w-full overflow-x-auto border-b border-slate-200">
                      <TabsList className="h-auto min-w-max justify-start gap-1 rounded-none bg-transparent p-0">
                        {tabs.map((tab) => (
                          <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className="
                              rounded-none
                              border-b-2
                              border-transparent
                              bg-transparent
                              px-3
                              py-3
                              text-sm
                              font-semibold
                              text-black
                              shadow-none
                              hover:bg-transparent
                              data-[state=active]:border-black
                              data-[state=active]:bg-transparent
                              data-[state=active]:text-black
                              data-[state=active]:shadow-none
                            "
                          >
                            {tab.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>

                    {/* APPLICATION ENTRY */}
                    <TabsContent
                      value="application"
                      className="mt-0 pt-6"
                    >
                      <ApplicationEntry
                        values={values.application}
                        setFieldValue={setFieldValue}
                      />
                    </TabsContent>

                    {/* PERSON TABS */}
                    {tabs
                      .filter(
                        (tab) =>
                          tab.value !== "application"
                      )
                      .map((tab) => (
                        <TabsContent
                          key={tab.value}
                          value={tab.value}
                          className="mt-0 pt-6"
                        >
                          <PersonDetails
                            type={tab.value}
                            title={tab.title}
                            photoLabel={tab.photoLabel}
                            thumbLabel={tab.thumbLabel}
                            values={
                              values?.[tab.value] ||
                              emptyPerson
                            }
                            setFieldValue={(
                              field,
                              value
                            ) =>
                              setFieldValue(
                                `${tab.value}.${field}`,
                                value
                              )
                            }
                            handleFile={(field, preview, file) =>
                              handleFile(
                                setFieldValue,
                                `${tab.value}.${field}`,
                                `${tab.value}.${preview}`,
                                file
                              )
                            }
                          />
                        </TabsContent>
                      ))}

                  <div className="mt-8 flex items-center justify-center gap-32 border-t border-slate-200 pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>

                    <Button
                      type="button"
                      onClick={() => window.print()}
                    >
                      Print
                    </Button>
                  </div>
                  </Tabs>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

/* =========================================================
   APPLICATION ENTRY
========================================================= */

function ApplicationEntry({ values, setFieldValue }) {
  const updateDocument = (index, field, value) => {
    const documents = [...(values.documents || [])];
    documents[index] = {
      ...documents[index],
      [field]: value,
    };
    setFieldValue("application.documents", documents);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-4">
        <SelectField
          label="Zone"
          required
          value={values.zone}
          options={zoneOptions}
          onChange={(value) =>
            setFieldValue("application.zone", value)
          }
        />

        <TextField
          label="Applicant First Name"
          required
          value={values.applicantFirstName}
          placeholder="Applicant First Name"
          onChange={(value) =>
            setFieldValue("application.applicantFirstName", value)
          }
        />

        <TextField
          label="Applicant Middle Name"
          required
          value={values.applicantMiddleName}
          placeholder="Applicant Middle Name"
          onChange={(value) =>
            setFieldValue("application.applicantMiddleName", value)
          }
        />

        <TextField
          label="Applicant Last Name"
          required
          value={values.applicantLastName}
          placeholder="Applicant Last Name"
          onChange={(value) =>
            setFieldValue("application.applicantLastName", value)
          }
        />

        <TextField
          label="Mobile No"
          required
          value={values.mobileNo}
          placeholder="Mobile No"
          maxLength={10}
          onChange={(value) =>
            setFieldValue(
              "application.mobileNo",
              value.replace(/\D/g, "")
            )
          }
        />

        <DateField
          label="Marriage Date"
          required
          value={values.marriageDate}
          onChange={(date) =>
            setFieldValue("application.marriageDate", date)
          }
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AddressField
          label="Address"
          value={values.address}
          placeholder="Address"
          onChange={(value) =>
            setFieldValue("application.address", value)
          }
        />

        <div />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AddressField
          label="Marriage Place English"
          value={values.marriagePlaceEnglish}
          placeholder="Marriage Place English"
          onChange={(value) =>
            setFieldValue(
              "application.marriagePlaceEnglish",
              value
            )
          }
        />

        <AddressField
          label="Marriage Place Marathi"
          value={values.marriagePlaceMarathi}
          placeholder="Marriage Place Marathi"
          onChange={(value) =>
            setFieldValue(
              "application.marriagePlaceMarathi",
              value
            )
          }
        />
      </div>

      <div className="mt-7 overflow-auto">
        <ShadCNTable
          headers={[
            "Sr No.",
            "Select",
            "Document Type",
            "Image(jpg,png)",
          ]}
          data={(values.documents || []).map((document, index) => ({
            srNo: document.id,
            select: (
              <Input
                type="checkbox"
                checked={Boolean(document.selected)}
                onChange={(e) =>
                  updateDocument(
                    index,
                    "selected",
                    e.target.checked
                  )
                }
                className="mx-auto h-4 w-4 cursor-pointer"
              />
            ),
            documentType: document.documentType,
            image: (
              <div className="min-w-[300px]">
                <Input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="h-10 w-full max-w-[420px] cursor-pointer"
                  onChange={(e) =>
                    updateDocument(
                      index,
                      "file",
                      e.currentTarget.files?.[0] || null
                    )
                  }
                />
                {document.file?.name && (
                  <div className="mt-1 text-xs">
                    {document.file.name}
                  </div>
                )}
              </div>
            ),
          }))}
          keyMapping={{
            "Sr No.": "srNo",
            Select: "select",
            "Document Type": "documentType",
            "Image(jpg,png)": "image",
          }}
          pagination={false}
        />
      </div>

     
    </div>
  );
}

function PersonDetails({
  type,
  title,
  photoLabel,
  thumbLabel,
  values,
  setFieldValue,
  handleFile,
}) {
  const isHusband = type === "husband";
  const isWife = type === "wife";
  const isPriest = type === "priest";
  const showMarriageFields = isHusband || isWife;

  return (
    <div className="w-full">
      {!isPriest && (
        <>
          <SectionTitle>{title}</SectionTitle>

          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <FilePreviewField
              label={photoLabel}
              required
              preview={values?.photoPreview}
              accept="image/*"
              onChange={(file) =>
                handleFile("photo", "photoPreview", file)
              }
            />
            <FilePreviewField
              label={thumbLabel}
              required
              preview={values?.thumbPreview}
              accept="image/*"
              onChange={(file) =>
                handleFile("thumb", "thumbPreview", file)
              }
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3">
        <TextField
          label="English First Name"
          required
          value={values?.englishFirstName}
          placeholder="First Name in English"
          onChange={(value) => setFieldValue("englishFirstName", value)}
        />
        <TextField
          label="English Middle Name"
          required
          value={values?.englishMiddleName}
          placeholder="Middle Name in English"
          onChange={(value) => setFieldValue("englishMiddleName", value)}
        />
        <TextField
          label="English Last Name"
          required
          value={values?.englishLastName}
          placeholder="Last Name in English"
          onChange={(value) => setFieldValue("englishLastName", value)}
        />

        <TextField
          label="Marathi First Name"
          required
          value={values?.marathiFirstName}
          placeholder="First Name in Marathi"
          onChange={(value) => setFieldValue("marathiFirstName", value)}
        />
        <TextField
          label="Marathi Middle Name"
          required
          value={values?.marathiMiddleName}
          placeholder="Middle Name in Marathi"
          onChange={(value) => setFieldValue("marathiMiddleName", value)}
        />
        <TextField
          label="Marathi Last Name"
          required
          value={values?.marathiLastName}
          placeholder="Last Name in Marathi"
          onChange={(value) => setFieldValue("marathiLastName", value)}
        />
      </div>

      {isPriest ? (
        <>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3">
            <TextField
              label="जन्म तारीख"
              required
              value={values?.age}
              placeholder="Age"
              maxLength={3}
              onChange={(value) =>
                setFieldValue("age", value.replace(/\D/g, ""))
              }
            />

            <SelectField
              label="धर्म"
              required
              value={values?.birthReligion}
              options={religionOptions}
              onChange={(value) =>
                setFieldValue("birthReligion", value)
              }
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
            <AddressField
              label="English Address"
              value={values?.englishAddress}
              placeholder="Address in English"
              onChange={(value) =>
                setFieldValue("englishAddress", value)
              }
            />
            <AddressField
              label="Marathi Address"
              value={values?.marathiAddress}
              placeholder="Address in Marathi"
              onChange={(value) =>
                setFieldValue("marathiAddress", value)
              }
            />
          </div>
        </>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-3">
            <SelectField
              label="दस्तऐवज"
              value={values?.documentType}
              options={documentOptions}
              onChange={(value) => setFieldValue("documentType", value)}
            />
            <SelectField
              label="नाते संबंध"
              value={values?.relation}
              options={relationOptions}
              onChange={(value) => setFieldValue("relation", value)}
            />
            <TextField
              label="मोबाईल"
              required
              value={values?.contact}
              placeholder="Mobile Number"
              maxLength={10}
              onChange={(value) =>
                setFieldValue("contact", value.replace(/\D/g, ""))
              }
            />
            <TextField
              label="Aadhar Card No"
              required
              value={values?.aadharNo}
              placeholder="Aadhar Card No"
              maxLength={12}
              onChange={(value) =>
                setFieldValue("aadharNo", value.replace(/\D/g, ""))
              }
            />
            <DateField
              label="जन्म तारीख"
              required
              value={values?.birthDate}
              onChange={(date) => setFieldValue("birthDate", date)}
            />
            <TextField
              label="लग्नाच्या वेळी वय"
              required
              value={values?.age}
              placeholder="Age"
              maxLength={3}
              onChange={(value) =>
                setFieldValue("age", value.replace(/\D/g, ""))
              }
            />

            {showMarriageFields && (
              <>
                <SelectField
                  label="मागील स्थिती"
                  value={values?.maritalStatus}
                  options={maritalStatusOptions}
                  onChange={(value) =>
                    setFieldValue("maritalStatus", value)
                  }
                />
                <SelectField
                  label="दिव्यांग"
                  value={values?.disability}
                  options={disabilityOptions}
                  onChange={(value) =>
                    setFieldValue("disability", value)
                  }
                />
                <SelectField
                  label="जन्माने धर्म"
                  value={values?.birthReligion}
                  options={religionOptions}
                  onChange={(value) =>
                    setFieldValue("birthReligion", value)
                  }
                />
                <SelectField
                  label="दत्तक घेऊन धर्म"
                  value={values?.adoptedReligion}
                  options={religionOptions}
                  onChange={(value) =>
                    setFieldValue("adoptedReligion", value)
                  }
                />
              </>
            )}

            <TextField
              label="ई-मेल आयडी"
              required
              value={values?.email}
              placeholder="Email Id"
              onChange={(value) => setFieldValue("email", value)}
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2">
            <AddressField
              label="English Address"
              value={values?.englishAddress}
              placeholder="Address in English"
              onChange={(value) => setFieldValue("englishAddress", value)}
            />
            <AddressField
              label="Marathi Address"
              value={values?.marathiAddress}
              placeholder="Address in Marathi"
              onChange={(value) => setFieldValue("marathiAddress", value)}
            />
          </div>

          {(isHusband || isWife) && (
            <div className="mt-8">
              <SectionTitle>लागू पूर्वीचे कागदपत्र</SectionTitle>
              <div className="space-y-4">
                <DocumentRow
                  label="ID Document"
                  value={values?.idDocument}
                  file={values?.idDocumentFile}
                  options={documentOptions}
                  onSelect={(value) =>
                    setFieldValue("idDocument", value)
                  }
                  onFile={(file) =>
                    setFieldValue("idDocumentFile", file)
                  }
                />
                <DocumentRow
                  label="रहिवासीचा पुरावा"
                  value={values?.addressDocument}
                  file={values?.addressDocumentFile}
                  options={documentOptions}
                  onSelect={(value) =>
                    setFieldValue("addressDocument", value)
                  }
                  onFile={(file) =>
                    setFieldValue("addressDocumentFile", file)
                  }
                />
                <DocumentRow
                  label="वयाचा पुरावा"
                  value={values?.ageDocument}
                  file={values?.ageDocumentFile}
                  options={documentOptions}
                  onSelect={(value) =>
                    setFieldValue("ageDocument", value)
                  }
                  onFile={(file) =>
                    setFieldValue("ageDocumentFile", file)
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =========================================================
   SHARED FORM FIELDS
========================================================= */

function SectionTitle({ children }) {
  return (
    <div
      className="mb-6 border-b border-slate-200 pb-3 text-center text-lg font-semibold"
    
    >
      {children}
    </div>
  );
}

function FieldLabel({ label, required }) {
  return (
    <div className="mb-1.5 flex items-center text-sm font-semibold text-black">
      <Label text={label} required={required} className="!w-auto text-black" />
      <span className="ml-0.5 text-black">:</span>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  required = false,
  maxLength,
  onChange,
}) {
  return (
    <div className="min-w-0">
      <FieldLabel label={label} required={required} />
      <Input
        value={value || ""}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options = [],
  required = false,
  onChange,
}) {
  return (
    <div className="min-w-0">
      <FieldLabel label={label} required={required} />
      <Select
        value={value ? String(value) : ""}
        onValueChange={onChange}
      >
        <SelectTrigger className="h-10 w-full">
          <SelectValue placeholder="-- Select Option --" />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem
              key={String(item.value)}
              value={String(item.value)}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function DateField({ label, value, required = false, onChange }) {
  return (
    <div className="min-w-0">
      <FieldLabel label={label} required={required} />
      <DatePicker
        value={value || undefined}
        onChange={onChange}
        className="h-10 w-full"
      />
    </div>
  );
}

function AddressField({
  label,
  value,
  placeholder,
  onChange,
}) {
  return (
    <div className="min-w-0">
      <FieldLabel label={label} required />
      <textarea
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          min-h-[76px]
          w-full
          resize-none
          rounded-sm
          border
          border-input
          bg-background
          px-3
          py-2
          text-sm
          shadow-sm
          outline-none
          placeholder:text-muted-foreground
          focus-visible:border-ring
          focus-visible:ring-2
          focus-visible:ring-ring/30
        "
      />
    </div>
  );
}

function FilePreviewField({
  label,
  required,
  preview,
  accept,
  onChange,
}) {
  return (
    <div className="min-w-0">
      <FieldLabel label={label} required={required} />

      <div className="flex flex-col items-center rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex h-[120px] w-[150px] items-center justify-center overflow-hidden rounded-sm border border-slate-300 bg-white">
          {preview ? (
            <img
              src={preview}
              alt={label}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-slate-400">
              Preview
            </span>
          )}
        </div>

        <Input
          type="file"
          accept={accept}
          className="h-10 w-full max-w-[320px] cursor-pointer bg-white"
          onChange={(e) =>
            onChange(e.currentTarget.files?.[0] || null)
          }
        />
      </div>
    </div>
  );
}

function DocumentRow({
  label,
  value,
  file,
  options,
  onSelect,
  onFile,
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-3 rounded-md border border-slate-200 p-3 lg:grid-cols-2">
      <div className="min-w-0">
        <FieldLabel label={label} required />
        <Select
          value={value ? String(value) : ""}
          onValueChange={onSelect}
        >
          <SelectTrigger className="h-10 w-full">
            <SelectValue placeholder="-- Select Option --" />
          </SelectTrigger>
          <SelectContent>
            {options.map((item) => (
              <SelectItem
                key={String(item.value)}
                value={String(item.value)}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0">
        <FieldLabel label="Upload Document" required />
        <Input
          type="file"
          className="h-10 w-full cursor-pointer"
          onChange={(e) =>
            onFile(e.currentTarget.files?.[0] || null)
          }
        />
        {file?.name && (
          <p className="mt-1 text-xs text-slate-500">
            {file.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default FrmMarriageRgstn;
