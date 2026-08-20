
// import React, { useState } from "react";
// import { Formik, Form } from "formik";
// import { motion } from "framer-motion";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { DatePicker } from "@/components/ui/calendar";
// import ShadCNTable from "@/components/ui/table";

// const initialValues = {
//   applicantName: "",
//   applicantAddress: "",

//   constructionPermission: "yes",
//   constructionCertificateNo: "",

//   usePermission: "yes",
//   useCertificateNo: "",
//   certificateDate: "",

//   propertyType: "residential",

//   prabhagOffice: "",
//   sectorNo: "",
//   surveyNo: "",
//   developmentProposalNo: "",

//   landOwnerName: "",
//   developerName: "",
//   advanceReceiptNo: "",
// };

// const sampleDocuments = [
//   { id: 1, docName: "भोगवटा प्रमाणपत्र" },
//   { id: 2, docName: "बांधकाम परवानगी" },
// ];

// const FrmNewTaxAssesment = () => {
//   const navigate = useNavigate();
//    const location = useLocation();
//    const { serviceID } = location.state || {};

//   const serviceid = serviceID || "289";

//   const getHeaderTitle = () => {
//     switch (serviceid) {
//       case "43":
//         return "New Assessment";
//       // case "44":
//       //   return "Re Assessment";
//       case "289":
//         return "Self Assessment";
//     }
//   };

//   const [documents, setDocuments] = useState(sampleDocuments);
//   const [docFiles, setDocFiles] = useState({});
//   const [docErrors, setDocErrors] = useState({});

//   const handleFileChange = (docId, event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const allowedExtensions = ["image/jpeg", "image/png", "application/pdf"];
//     const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

//     if (!allowedExtensions.includes(file.type)) {
//       setDocErrors((prev) => ({
//         ...prev,
//         [docId]: "Document Should Be Acceptable In JPEG/JPG/PNG/PDF Format Only",
//       }));
//       event.target.value = "";
//       return;
//     }

//     if (file.size > maxSizeInBytes) {
//       setDocErrors((prev) => ({
//         ...prev,
//         [docId]: "Document Size Should Be < 5 mb",
//       }));
//       event.target.value = "";
//       return;
//     }

//     setDocErrors((prev) => ({ ...prev, [docId]: null }));
//     setDocFiles((prev) => ({ ...prev, [docId]: file }));
//   };

//   const headers = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];
  
//   const keyMapping = {
//     "Sr No.": "srNo",
//     "Document Name": "docName",
//     "Image(jpg,png,pdf)": "fileUpload",
//   };

//   const columnStyles = {
//     "Sr No.": { width: "10%" },
//     "Document Name": { width: "50%" },
//     "Image(jpg,png,pdf)": { width: "40%" },
//   };

//   // Map rows to pass component elements to ShadCNTable
//   const tableData = documents.map((doc, idx) => ({
//     srNo: idx + 1,
//     docName: doc.docName,
//     fileUpload: (
//       <div className="flex flex-col gap-1 items-start text-left">
//         <input
//           type="file"
//           accept=".jpg,.jpeg,.png,.pdf"
//           onChange={(e) => handleFileChange(doc.id, e)}
//           className="text-xs sm:text-sm text-slate-700 file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-gray-300 file:text-xs file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer"
//         />
//         {docErrors[doc.id] && (
//           <span className="text-xs text-red-500 font-medium">
//             {docErrors[doc.id]}
//           </span>
//         )}
//       </div>
//     ),
//   }));

//   const handleSubmit = (values) => {
//     console.log("Assessment Data:", values);
//     console.log("Uploaded Documents:", docFiles);
//   };

//   return (
//     <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//       {({ values, handleChange, setFieldValue }) => (
//         <Form className="w-full">
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-6"
//           >
//             <Card className="w-full border shadow-sm">
//               <CardHeader className="border-b px-3 sm:px-5 md:px-6 py-3 sm:py-4">
//                 <CardTitle className="text-base sm:text-lg md:text-xl">
//                   {getHeaderTitle()}
//                 </CardTitle>
//               </CardHeader>

//               <CardContent className="p-3 sm:p-5 md:p-6 lg:p-7">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
//                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                     <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                       <Label className="text-sm sm:text-base" text="अर्जदाराचे नाव" />
//                       <span className="hidden md:block">:</span>
//                     </div>
//                     <Input
//                       name="applicantName"
//                       value={values.applicantName}
//                       onChange={handleChange}
//                       className="w-full h-9 sm:h-10"
//                     />
//                   </div>

//                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                     <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                       <Label className="text-sm sm:text-base" text="अर्जदाराचे पत्ता" />
//                       <span className="hidden md:block">:</span>
//                     </div>
//                     <Input
//                       name="applicantAddress"
//                       value={values.applicantAddress}
//                       onChange={handleChange}
//                       className="w-full h-9 sm:h-10"
//                     />
//                   </div>
//                 </div>

//                 <div className="border-t mt-6 sm:mt-7 pt-5 sm:pt-6">
//                   <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-5">
//                     मालमत्तेचा तपशील
//                   </h3>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-56 lg:w-64 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base whitespace-nowrap"
//                           text="मालमत्ता बांधकामास परवानगी आहे का?"
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-5">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <Input
//                             type="radio"
//                             name="constructionPermission"
//                             value="yes"
//                             checked={values.constructionPermission === "yes"}
//                             onChange={handleChange}
//                             className="h-4 w-4"
//                           />
//                           <span className="text-sm sm:text-base">हो</span>
//                         </label>

//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <Input
//                             type="radio"
//                             name="constructionPermission"
//                             value="no"
//                             checked={values.constructionPermission === "no"}
//                             onChange={handleChange}
//                             className="h-4 w-4"
//                           />
//                           <span className="text-sm sm:text-base">नाही</span>
//                         </label>
//                       </div>
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-28 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="असल्यास" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="constructionCertificateNo"
//                         value={values.constructionCertificateNo}
//                         onChange={handleChange}
//                         placeholder="परवानगी प्रमाणपत्र क्रमांक"
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 lg:col-span-1">
//                       <div className="w-full md:w-56 lg:w-64 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base whitespace-nowrap"
//                           text="मालमत्ता वापर परवानगी आहे का?"
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-5">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <Input
//                             type="radio"
//                             name="usePermission"
//                             value="yes"
//                             checked={values.usePermission === "yes"}
//                             onChange={handleChange}
//                             className="h-4 w-4"
//                           />
//                           <span className="text-sm sm:text-base">हो</span>
//                         </label>

//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <Input
//                             type="radio"
//                             name="usePermission"
//                             value="no"
//                             checked={values.usePermission === "no"}
//                             onChange={handleChange}
//                             className="h-4 w-4"
//                           />
//                           <span className="text-sm sm:text-base">नाही</span>
//                         </label>
//                       </div>
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-24 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="असल्यास" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="useCertificateNo"
//                         value={values.useCertificateNo}
//                         onChange={handleChange}
//                         placeholder="प्रमाणपत्र क्रमांक"
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mt-5">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-32 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="प्रमाणपत्र दिनांक" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <DatePicker
//                         value={values.certificateDate}
//                         onChange={(date) => setFieldValue("certificateDate", date)}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mt-6">
//                     <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                       <Label className="text-sm sm:text-base" text="मालमत्तेचा प्रकार" />
//                       <span className="hidden md:block">:</span>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-3">
//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <Input
//                           type="radio"
//                           name="propertyType"
//                           value="residential"
//                           checked={values.propertyType === "residential"}
//                           onChange={handleChange}
//                           className="h-4 w-4"
//                         />
//                         <span className="text-sm sm:text-base">सदनिका</span>
//                       </label>

//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <Input
//                           type="radio"
//                           name="propertyType"
//                           value="shop"
//                           checked={values.propertyType === "shop"}
//                           onChange={handleChange}
//                           className="h-4 w-4"
//                         />
//                         <span className="text-sm sm:text-base">गाळा</span>
//                       </label>

//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <Input
//                           type="radio"
//                           name="propertyType"
//                           value="office"
//                           checked={values.propertyType === "office"}
//                           onChange={handleChange}
//                           className="h-4 w-4"
//                         />
//                         <span className="text-sm sm:text-base">ऑफिस</span>
//                       </label>

//                       <label className="flex items-center gap-2 cursor-pointer">
//                         <Input
//                           type="radio"
//                           name="propertyType"
//                           value="landTax"
//                           checked={values.propertyType === "landTax"}
//                           onChange={handleChange}
//                           className="h-4 w-4"
//                         />
//                         <span className="text-sm sm:text-base">जमिनीवरील कर</span>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-6">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="प्रभाग कार्यालय" />
//                         <span className="hidden md:block">:</span>
//                       </div>

//                       <Select
//                         value={values.prabhagOffice}
//                         onValueChange={(value) => setFieldValue("prabhagOffice", value)}
//                       >
//                         <SelectTrigger className="w-full h-9 sm:h-10">
//                           <SelectValue placeholder="-- Select Option --" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="1">प्रभाग कार्यालय 1</SelectItem>
//                           <SelectItem value="2">प्रभाग कार्यालय 2</SelectItem>
//                           <SelectItem value="3">प्रभाग कार्यालय 3</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="सेक्टर क्रमांक" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="sectorNo"
//                         value={values.sectorNo}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="टीका व सर्वे" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="surveyNo"
//                         value={values.surveyNo}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="विकास प्रस्ताव क्र" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="developmentProposalNo"
//                         value={values.developmentProposalNo}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base whitespace-nowrap"
//                           text="जमीन मालकाचे नाव"
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="landOwnerName"
//                         value={values.landOwnerName}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label className="text-sm sm:text-base" text="विकासकाचे नाव" />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="developerName"
//                         value={values.developerName}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base whitespace-nowrap"
//                           text="अग्रीम कराची पावती क्र."
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="advanceReceiptNo"
//                         value={values.advanceReceiptNo}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Document Upload Table */}
//                 <div className="border-t mt-6 sm:mt-7 pt-5 sm:pt-6">
//                   <ShadCNTable
//                     headers={headers}
//                     data={tableData}
//                     keyMapping={keyMapping}
//                     columnStyles={columnStyles}
//                   />
//                 </div>

//                 {/* Form Buttons */}
//                 <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-7">
//                   <Button
//                     type="submit"
//                     className="w-full sm:w-auto px-6 h-9 sm:h-10 text-white"
//                   >
//                     Submit
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="w-full sm:w-auto px-6 h-9 sm:h-10 bg-gray-100 hover:bg-gray-200"
//                     onClick={() => navigate("/")}
//                   >
//                     Back
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default FrmNewTaxAssesment;




import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import ShadCNTable from "@/components/ui/table";

  const BASE_URL = import.meta.env.VITE_BASE_URL; 

const initialValues = {
  applicantName: "",
  applicantAddress: "",
  constructionPermission: "yes",
  constructionCertificateNo: "",
  usePermission: "yes",
  useCertificateNo: "",
  certificateDate: "",
  propertyType: "residential",
  prabhagOffice: "",
  sectorNo: "",
  surveyNo: "",
  developmentProposalNo: "",
  landOwnerName: "",
  developerName: "",
  advanceReceiptNo: "",
};

const FrmNewTaxAssesment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceID } = location.state || {};
  const serviceid = serviceID || "43";

  const [wards, setWards] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [docFiles, setDocFiles] = useState({});
  const [docErrors, setDocErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const ulbId = 3; 
  const userId = localStorage.getItem("userId") || "3";

  const getHeaderTitle = () => {
    switch (String(serviceid)) {
      case "43":
        return "New Assessment";
      case "289":
        return "Self Assessment";
      default:
        return "New Assessment";
    }
  };

  useEffect(() => {
    fetchWards();
    fetchDocuments();
  }, [serviceid]);

  const fetchWards = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmNewTaxAssesment/wards`,
        { ulbid: ulbId },
      );
      if (response.data?.data?.wards) {
        setWards(response.data.data.wards);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/documents`,
        { serviceId: Number(serviceid), ulbId: ulbId },
        
      );
      if (response.data?.data?.rows) {
        setDocuments(response.data.data.rows);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileChange = (docId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ["image/jpeg", "image/png", "application/pdf"];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    if (!allowedExtensions.includes(file.type)) {
      setDocErrors((prev) => ({
        ...prev,
        [docId]: "Document Should Be Acceptable In JPEG/JPG/PNG/PDF Format Only",
      }));
      event.target.value = "";
      return;
    }

    if (file.size > maxSizeInBytes) {
      setDocErrors((prev) => ({
        ...prev,
        [docId]: "Document Size Should Be < 5 mb",
      }));
      event.target.value = "";
      return;
    }

    setDocErrors((prev) => ({ ...prev, [docId]: null }));
    setDocFiles((prev) => ({ ...prev, [docId]: file }));
  };

  const uploadDocument = async (applicationNo, docId, file) => {
    if (!file) return true;

    const formData = new FormData();
    formData.append("serviceId", serviceid);
    formData.append("appNo", applicationNo);
    formData.append("docType", file.type.includes("pdf") ? "PDF" : "IMG");
    formData.append("documentId", String(docId));
    formData.append("document", file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmAssessmentCerti/upload-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data?.success || response.data?.ok;
    } catch (error) {
      console.error(`Error uploading document ${docId}:`, error);
      return false;
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const payload = {
      userId: userId,
      zoneId: 261, 
      serviceId: Number(serviceid),
      appliName: values.applicantName,
      appliAdd: values.applicantAddress,
      propConstrFlag: values.constructionPermission === "yes" ? "Y" : "N",
      propUsageFlag: values.usePermission === "yes" ? "R" : "N",
      permisCertNo: values.constructionCertificateNo,
      parvanaCertNo: values.useCertificateNo,
      parvanaDate: values.certificateDate
        ? new Date(values.certificateDate).toISOString().split("T")[0]
        : "",
      propTypeFlag:
        values.propertyType === "residential"
          ? "RES"
          : values.propertyType === "shop"
          ? "COMM"
          : values.propertyType === "office"
          ? "OFF"
          : "LAND",
      sectorNo: values.sectorNo,
      remarkSurvey: values.surveyNo,
      prabhagKarType: Number(values.prabhagOffice) || 1,
      vikasAppealNo: values.developmentProposalNo,
      propOwnName: values.landOwnerName,
      vikasName: values.developerName,
      taxesReceipt: values.advanceReceiptNo,
      appSource: "WEB",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmNewTaxAssesment/new-tax-asses`,
        payload,
        
      );

      if (response.data?.ok && response.data?.data?.applicationNo) {
        const appNo = response.data.data.applicationNo;

        const uploadPromises = Object.keys(docFiles).map((docId) =>
          uploadDocument(appNo, docId, docFiles[docId])
        );

        await Promise.all(uploadPromises);

        alert(`Assessment Saved Successfully! Application No: ${appNo}`);
        navigate("/");
      } else {
        alert(response.data?.message || "Failed to save assessment details.");
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("An error occurred while processing the request.");
    } finally {
      setLoading(false);
    }
  };

  const headers = ["Sr No.", "Document Name", "Image(jpg,png,pdf)"];

  const keyMapping = {
    "Sr No.": "srNo",
    "Document Name": "docName",
    "Image(jpg,png,pdf)": "fileUpload",
  };

  const columnStyles = {
    "Sr No.": { width: "10%" },
    "Document Name": { width: "50%" },
    "Image(jpg,png,pdf)": { width: "40%" },
  };

  const tableData = documents.map((doc, idx) => ({
    srNo: idx + 1,
    docName: doc.DOCNAME,
    fileUpload: (
      <div className="flex flex-col gap-1 items-start text-left">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange(doc.DOCID, e)}
          className="text-xs sm:text-sm text-slate-700 file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-gray-300 file:text-xs file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer"
        />
        {docErrors[doc.DOCID] && (
          <span className="text-xs text-red-500 font-medium">
            {docErrors[doc.DOCID]}
          </span>
        )}
      </div>
    ),
  }));

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue }) => (
        <Form className="w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-6"
          >
            <Card className="w-full border shadow-sm">
              <CardHeader className="border-b px-3 sm:px-5 md:px-6 py-3 sm:py-4">
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  {getHeaderTitle()}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 sm:p-5 md:p-6 lg:p-7">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                      <Label className="text-sm sm:text-base" text="अर्जदाराचे नाव" />
                      <span className="hidden md:block">:</span>
                    </div>
                    <Input
                      name="applicantName"
                      value={values.applicantName}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                      <Label className="text-sm sm:text-base" text="अर्जदाराचे पत्ता" />
                      <span className="hidden md:block">:</span>
                    </div>
                    <Input
                      name="applicantAddress"
                      value={values.applicantAddress}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="border-t mt-6 sm:mt-7 pt-5 sm:pt-6">
                  <h3 className="font-semibold text-base sm:text-lg md:text-xl mb-5">
                    मालमत्तेचा तपशील
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-56 lg:w-64 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base whitespace-nowrap"
                          text="मालमत्ता बांधकामास परवानगी आहे का?"
                        />
                        <span className="hidden md:block">:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            name="constructionPermission"
                            value="yes"
                            checked={values.constructionPermission === "yes"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          <span className="text-sm sm:text-base">हो</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            name="constructionPermission"
                            value="no"
                            checked={values.constructionPermission === "no"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          <span className="text-sm sm:text-base">नाही</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-28 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="असल्यास" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="constructionCertificateNo"
                        value={values.constructionCertificateNo}
                        onChange={handleChange}
                        placeholder="परवानगी प्रमाणपत्र क्रमांक"
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 lg:col-span-1">
                      <div className="w-full md:w-56 lg:w-64 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base whitespace-nowrap"
                          text="मालमत्ता वापर परवानगी आहे का?"
                        />
                        <span className="hidden md:block">:</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            name="usePermission"
                            value="yes"
                            checked={values.usePermission === "yes"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          <span className="text-sm sm:text-base">हो</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <Input
                            type="radio"
                            name="usePermission"
                            value="no"
                            checked={values.usePermission === "no"}
                            onChange={handleChange}
                            className="h-4 w-4"
                          />
                          <span className="text-sm sm:text-base">नाही</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-24 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="असल्यास" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="useCertificateNo"
                        value={values.useCertificateNo}
                        onChange={handleChange}
                        placeholder="प्रमाणपत्र क्रमांक"
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 mt-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-32 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="प्रमाणपत्र दिनांक" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <DatePicker
                        value={values.certificateDate}
                        onChange={(date) => setFieldValue("certificateDate", date)}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mt-6">
                    <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                      <Label className="text-sm sm:text-base" text="मालमत्तेचा प्रकार" />
                      <span className="hidden md:block">:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="residential"
                          checked={values.propertyType === "residential"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <span className="text-sm sm:text-base">सदनिका</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="shop"
                          checked={values.propertyType === "shop"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <span className="text-sm sm:text-base">गाळा</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="office"
                          checked={values.propertyType === "office"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <span className="text-sm sm:text-base">ऑफिस</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="propertyType"
                          value="landTax"
                          checked={values.propertyType === "landTax"}
                          onChange={handleChange}
                          className="h-4 w-4"
                        />
                        <span className="text-sm sm:text-base">जमिनीवरील कर</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="प्रभाग कार्यालय" />
                        <span className="hidden md:block">:</span>
                      </div>

                      <Select
                        value={values.prabhagOffice}
                        onValueChange={(value) => setFieldValue("prabhagOffice", value)}
                      >
                        <SelectTrigger className="w-full h-9 sm:h-10">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map((ward) => (
                            <SelectItem key={ward.wardId} value={String(ward.wardId)}>
                              {ward.wardName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="सेक्टर क्रमांक" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="sectorNo"
                        value={values.sectorNo}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="टीका व सर्वे" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="surveyNo"
                        value={values.surveyNo}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="विकास प्रस्ताव क्र" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="developmentProposalNo"
                        value={values.developmentProposalNo}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base whitespace-nowrap"
                          text="जमीन मालकाचे नाव"
                        />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="landOwnerName"
                        value={values.landOwnerName}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label className="text-sm sm:text-base" text="विकासकाचे नाव" />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="developerName"
                        value={values.developerName}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mt-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <div className="w-full md:w-40 lg:w-44 shrink-0 flex items-center justify-between">
                        <Label
                          className="text-sm sm:text-base whitespace-nowrap"
                          text="अग्रीम कराची पावती क्र."
                        />
                        <span className="hidden md:block">:</span>
                      </div>
                      <Input
                        name="advanceReceiptNo"
                        value={values.advanceReceiptNo}
                        onChange={handleChange}
                        className="w-full h-9 sm:h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t mt-6 sm:mt-7 pt-5 sm:pt-6">
                  <ShadCNTable
                    headers={headers}
                    data={tableData}
                    keyMapping={keyMapping}
                    pagination={false}
                    className="max-md:min-w-340"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 pt-7">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 h-9 sm:h-10 text-white"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto px-6 h-9 sm:h-10 bg-gray-100 hover:bg-gray-200"
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Form>
      )}
    </Formik>
  );
};

export default FrmNewTaxAssesment;