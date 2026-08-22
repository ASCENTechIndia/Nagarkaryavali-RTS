import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import axios from "axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const FrmWaterConnectionApplication = () => {
  // ============================================================
  // LOCATION / SERVICE DETAILS
  // ============================================================

  const location = useLocation();

const serviceId = location.state?.serviceId || 27
const ulbId = location.state?.ulbId || 3;


  console.log("Service ID:", serviceId);
  console.log("ULB ID:", ulbId);

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    zone: "",

    firstName: "",
    middleName: "",
    lastName: "",

    firstNameMarathi: "",
    middleNameMarathi: "",
    lastNameMarathi: "",

    mobileNo: "",
    aadharNo: "",
    email: "",

    address: "",
    addressMarathi: "",

    purpose: "",
    purposeMarathi: "",

    connectionNo: "",

    consumeType: "",
    meterType: "",
  });

  // ============================================================
  // ZONE
  // ============================================================

  const [zoneList, setZoneList] = useState([]);
  const [zoneLoading, setZoneLoading] = useState(false);

  // ============================================================
  // CONSUMER TYPE
  // ============================================================

  const [consumerTypeList, setConsumerTypeList] = useState([]);
  const [consumerTypeLoading, setConsumerTypeLoading] =
    useState(false);

  // ============================================================
  // METER TYPE
  // ============================================================

  const [meterTypeList, setMeterTypeList] = useState([]);
  const [meterTypeLoading, setMeterTypeLoading] =
    useState(false);

  // ============================================================
  // DOCUMENTS
  // ============================================================

  const [documentList, setDocumentList] = useState([]);
  const [documentLoading, setDocumentLoading] =
    useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

  const [documentFiles, setDocumentFiles] = useState({});

  // ============================================================
  // COMMON CHANGE HANDLER
  // ============================================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // DOCUMENT FILE CHANGE
  // ============================================================

  const handleDocumentFileChange = (docId, file) => {
    setDocumentFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  // ============================================================
  // FETCH ZONES / WARDS
  // ============================================================

  const fetchZones = async () => {
    try {
      setZoneLoading(true);

      const BASE_URL =
        import.meta.env.VITE_BASE_URL;

      const url =
        `${BASE_URL}/api/watermodule/wards`;

      console.log("Fetching zones:", url);

      const response = await axios.get(url);

      console.log(
        "Zone API Response:",
        response.data
      );

      if (
        response?.data?.ok === true &&
        response?.data?.data?.success === true
      ) {
        const zones =
          response.data.data.data || [];

        setZoneList(zones);

        console.log(
          "Zone List:",
          zones
        );
      } else {
        setZoneList([]);

        console.error(
          "Zone API Error:",
          response?.data?.message
        );
      }
    } catch (error) {
      console.error(
        "Fetch Zone API Error:",
        error
      );

      console.error(
        "Zone Error Response:",
        error?.response?.data
      );

      setZoneList([]);
    } finally {
      setZoneLoading(false);
    }
  };

  // ============================================================
  // FETCH CONSUMER TYPES
  // ============================================================

  const fetchConsumerTypes = async () => {
    try {
      setConsumerTypeLoading(true);

      const BASE_URL =
        import.meta.env.VITE_BASE_URL;

      const url =
        `${BASE_URL}/api/watermodule/water-consumer-types`;

      console.log(
        "Fetching consumer types:",
        url
      );

      const response = await axios.get(url);

      console.log(
        "Consumer Type Response:",
        response.data
      );

      if (
        response?.data?.ok === true &&
        response?.data?.data?.success === true
      ) {
        const consumerTypes =
          response.data.data.data || [];

        setConsumerTypeList(
          consumerTypes
        );

        console.log(
          "Consumer Type List:",
          consumerTypes
        );
      } else {
        setConsumerTypeList([]);

        console.error(
          "Consumer Type API Error:",
          response?.data?.message
        );
      }
    } catch (error) {
      console.error(
        "Consumer Type API Error:",
        error
      );

      console.error(
        "Consumer Type Error Response:",
        error?.response?.data
      );

      setConsumerTypeList([]);
    } finally {
      setConsumerTypeLoading(false);
    }
  };

  // ============================================================
  // FETCH METER TYPES
  // ============================================================

  const fetchMeterTypes = async () => {
    try {
      setMeterTypeLoading(true);

      const BASE_URL =
        import.meta.env.VITE_BASE_URL;

      const url =
        `${BASE_URL}/api/watermodule/water-meter-types`;

      console.log(
        "Fetching meter types:",
        url
      );

      const response = await axios.get(url);

      console.log(
        "Meter Type Response:",
        response.data
      );

      if (
        response?.data?.ok === true &&
        response?.data?.data?.success === true
      ) {
        const meterTypes =
          response.data.data.data || [];

        setMeterTypeList(
          meterTypes
        );

        console.log(
          "Meter Type List:",
          meterTypes
        );
      } else {
        setMeterTypeList([]);

        console.error(
          "Meter Type API Error:",
          response?.data?.message
        );
      }
    } catch (error) {
      console.error(
        "Meter Type API Error:",
        error
      );

      console.error(
        "Meter Type Error Response:",
        error?.response?.data
      );

      setMeterTypeList([]);
    } finally {
      setMeterTypeLoading(false);
    }
  };

  // ============================================================
  // FETCH SERVICE DOCUMENTS
  // ============================================================

  const fetchServiceDocuments = async () => {
    try {
      if (!serviceId || !ulbId) {
        console.error(
          "Service ID or ULB ID is missing",
          {
            serviceId,
            ulbId,
          }
        );

        setDocumentList([]);
        return;
      }

      setDocumentLoading(true);

      const BASE_URL =
        import.meta.env.VITE_BASE_URL;

      const url =
        `${BASE_URL}/api/watermodule/service-documents`;

      console.log(
        "Fetching service documents:",
        {
          url,
          serviceId,
          ulbId,
        }
      );

      const response = await axios.get(
        url,
        {
          params: {
            serviceId: serviceId,
            ulbid: ulbId,
          },
        }
      );

      console.log(
        "Service Documents Response:",
        response.data
      );

      if (
        response?.data?.ok === true &&
        response?.data?.data?.success === true
      ) {
        const documents =
          response.data.data.data || [];

        setDocumentList(documents);

        console.log(
          "Document List:",
          documents
        );
      } else {
        setDocumentList([]);

        Swal.fire({
          icon: "error",
          title: "Unable to Load Documents",
          text:
            response?.data?.message ||
            "Unable to fetch service documents.",
        });
      }
    } catch (error) {
      console.error(
        "Service Documents API Error:",
        error
      );

      console.error(
        "Service Documents Error Response:",
        error?.response?.data
      );

      setDocumentList([]);

      Swal.fire({
        icon: "error",
        title: "Document Loading Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Unable to load service documents.",
      });
    } finally {
      setDocumentLoading(false);
    }
  };

  // ============================================================
  // INITIAL DROPDOWN API CALLS
  // ============================================================

  useEffect(() => {
    fetchZones();
    fetchConsumerTypes();
    fetchMeterTypes();
  }, []);

  // ============================================================
  // DOCUMENT API
  // ============================================================

  useEffect(() => {
    if (serviceId && ulbId) {
      fetchServiceDocuments();
    }
  }, [serviceId, ulbId]);

  // ============================================================
  // SUBMIT
  // ============================================================

 const handleSubmit = async () => {
  // ============================================================
  // BASIC VALIDATION
  // ============================================================

  if (!formData.zone) {
    Swal.fire({
      icon: "warning",
      text: "Please select Zone.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.firstName.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter First Name.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.lastName.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Last Name.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.firstNameMarathi.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter First Name in Marathi.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.lastNameMarathi.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Last Name in Marathi.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.mobileNo.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Mobile Number.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (formData.mobileNo.length !== 10) {
    Swal.fire({
      icon: "warning",
      text: "Please enter a valid 10 digit Mobile Number.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.aadharNo.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Aadhar Card Number.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (formData.aadharNo.length !== 12) {
    Swal.fire({
      icon: "warning",
      text: "Please enter a valid 12 digit Aadhar Number.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.email.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Email.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.address.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Address.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.addressMarathi.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Address in Marathi.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.purpose.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Purpose.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.purposeMarathi.trim()) {
    Swal.fire({
      icon: "warning",
      text: "Please enter Purpose in Marathi.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.consumeType) {
    Swal.fire({
      icon: "warning",
      text: "Please select Consumer Type.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }

  if (!formData.meterType) {
    Swal.fire({
      icon: "warning",
      text: "Please select Meter Type.",
      confirmButtonColor: "#1e3a8a",
    });
    return;
  }


  const BASE_URL =
    import.meta.env.VITE_BASE_URL;

  const userId = 15;


  const selectedDocuments = documentList
    .map((document) => {
      const file =
        documentFiles[document.DOCID];

      if (!file) {
        return null;
      }

      return {
        documentId: document.DOCID,
        documentName:
          document.DOCNAME || "",
        documentType:
          document.DOCTYPE || "",
        file: file,
      };
    })
    .filter(Boolean);

  console.log(
    "Selected Documents:",
    selectedDocuments
  );

  // ============================================================
  // CONFIRM SUBMISSION
  // ============================================================

  const confirmResult =
    await Swal.fire({
      icon: "question",
      title: "Submit Application?",
      text: "Are you sure you want to submit this application?",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1e3a8a",
    });

  if (!confirmResult.isConfirmed) {
    return;
  }

  // ============================================================
  // START SUBMISSION
  // ============================================================

  try {
    setIsSubmitting(true);

    Swal.fire({
      title: "Submitting Application...",
      text: "Please wait while your application is being processed.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // ==========================================================
    // PROCEDURE PAYLOAD
    // ==========================================================

    const savePayload = {
      in_ulbid: Number(ulbId),
      in_corpid: Number(ulbId),

      in_serviceid: Number(serviceId),

      in_userid: Number(userId),


      in_firstname:
        formData.firstName.trim(),

      in_firstnameM:
        formData.firstNameMarathi.trim(),

      in_middlename:
        formData.middleName.trim(),

      in_middlenameM:
        formData.middleNameMarathi.trim(),

      in_lastname:
        formData.lastName.trim(),

      in_lastnameM:
        formData.lastNameMarathi.trim(),

      in_mobileno:
        Number(formData.mobileNo),

      in_adharno:
        formData.aadharNo.trim(),

      in_email:
        formData.email.trim(),

      in_address:
        formData.address.trim(),

      in_addressM:
        formData.addressMarathi.trim(),

      in_purpose:
        formData.purpose.trim(),

      in_purposeM:
        formData.purposeMarathi.trim(),

      in_zoneid:
        Number(formData.zone),

      in_wardno:
        Number(formData.zone),

      in_propertyno:
        formData.connectionNo.trim(),


      in_mode: 1,

      in_PropertyUsage: 1,

      in_SellerName: "",

      in_TransferToWhom: "",

      in_AgreementDate:
        new Date()
          .toISOString()
          .split("T")[0],

      in_AppNo: "",

      in_wtsewrgtypeid: 1,

      in_nocpurposeid: 1,

      in_RegiNo: "",

      in_UniqueNo: "",

      in_appsource: "RTS",

      in_deliveryflag: "N",

      in_consumertypeid:
        Number(formData.consumeType),

      in_metertypeid:
        Number(formData.meterType),
    };

    console.log(
      "Water Save Payload:",
      savePayload
    );


    const saveResponse =
      await axios.post(
        `${BASE_URL}/api/watermodule/save`,
        savePayload
      );

    console.log(
      "Save API Response:",
      saveResponse.data
    );


    if (
      saveResponse?.data?.ok !== true
    ) {
      Swal.close();

      await Swal.fire({
        icon: "error",
        title: "Application Failed",
        text:
          saveResponse?.data?.message ||
          "Application could not be processed.",
        confirmButtonColor: "#1e3a8a",
      });

      return;
    }


    const saveData =
      saveResponse?.data?.data;

    const procedureData =
      saveData?.data;

    const errorCode =
      Number(
        procedureData?.errorCode
      );

    const errorMessage =
      procedureData?.message ||
      saveData?.message ||
      saveResponse?.data?.message ||
      "";

    const applicationNo =
      procedureData?.appNo;

    console.log(
      "Procedure Error Code:",
      errorCode
    );

    console.log(
      "Procedure Message:",
      errorMessage
    );

    console.log(
      "Application No:",
      applicationNo
    );

    if (
      errorCode !== 9999 ||
      !applicationNo
    ) {
      Swal.close();

      await Swal.fire({
        icon: "error",
        title: "Application Failed",
        text:
          errorMessage ||
          "Application could not be processed.",
        confirmButtonColor: "#1e3a8a",
      });

      return;
    }



    console.log(
      "Application Created:",
      applicationNo
    );



    const uploadResults = [];

    for (
      const document
      of selectedDocuments
    ) {

      try {

        console.log(
          "Uploading Document:",
          {
            applicationNo,
            documentId:
              document.documentId,
            documentName:
              document.documentName,
            fileName:
              document.file.name,
          }
        );

        // ------------------------------------------------------
        // DOCUMENT TYPE
        // ------------------------------------------------------

       // ------------------------------------------------------
// DOCUMENT TYPE FROM ACTUAL FILE
// ------------------------------------------------------

const extension = document.file.name
  .split(".")
  .pop()
  ?.toLowerCase();

let docType = "PDF";

if (extension === "pdf") {
  docType = "PDF";
} else if (
  extension === "jpg" ||
  extension === "jpeg"
) {
  docType = "JPG";
} else if (extension === "png") {
  docType = "PNG";
}
   

        const uploadFormData =
          new FormData();

      uploadFormData.append(
  "documents",
  document.file,
  document.file.name
);

        const uploadResponse =
          await axios.post(
            `${BASE_URL}/api/watermodule/upload-app-doc`,
            uploadFormData,
            {
              params: {
                CorpId:
                  Number(ulbId),

                ServiceId:
                  Number(serviceId),

                AppNo:
                  applicationNo,

                DocType:
                  docType,

                DocumentId:
                  document.documentId,
              },

              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        console.log(
          "Document Upload Response:",
          uploadResponse.data
        );

        // ------------------------------------------------------
        // CHECK UPLOAD
        // ------------------------------------------------------

        if (
          uploadResponse?.data?.ok !== true
        ) {

          throw new Error(
            uploadResponse?.data?.message ||
            `Failed to upload ${document.documentName}`
          );

        }

        uploadResults.push({
          documentId:
            document.documentId,

          documentName:
            document.documentName,

          fileName:
            document.file.name,

          success: true,

          response:
            uploadResponse.data,
        });

      } catch (uploadError) {

        console.error(
          "Document Upload Error:",
          uploadError
        );

        uploadResults.push({
          documentId:
            document.documentId,

          documentName:
            document.documentName,

          fileName:
            document.file.name,

          success: false,

          message:
            uploadError?.response?.data
              ?.message ||
            uploadError?.message ||
            "Document upload failed.",
        });

      }
    }

    // ==========================================================
    // CHECK DOCUMENT UPLOAD RESULTS
    // ==========================================================

    const failedUploads =
      uploadResults.filter(
        (item) =>
          item.success !== true
      );

    // ==========================================================
    // SOME DOCUMENTS FAILED
    // ==========================================================

    if (
      failedUploads.length > 0
    ) {

      Swal.close();

      const failedNames =
        failedUploads
          .map(
            (item) =>
              item.documentName
          )
          .join(", ");

      await Swal.fire({
        icon: "warning",
        title: "Application Saved",
        html: `
          <div style="text-align:left">
            <p>
              Application No:
              <strong>${applicationNo}</strong>
            </p>

            <p>
              Application was submitted successfully,
              but the following document(s) could not
              be uploaded:
            </p>

            <p>
              <strong>${failedNames}</strong>
            </p>
          </div>
        `,
        confirmButtonColor: "#1e3a8a",
      });

      return;
    }

    // ==========================================================
    // EVERYTHING SUCCESSFUL
    // ==========================================================

    Swal.close();

    await Swal.fire({
      icon: "success",
      title: "Application Submitted Successfully",
      html: `
        <div style="text-align:center">
          <p>
            Application No:
            <strong>${applicationNo}</strong>
          </p>

          <p>
            Application and documents have been
            submitted successfully.
          </p>
        </div>
      `,
      confirmButtonColor: "#1e3a8a",
    });

    // ==========================================================
    // OPTIONAL: CLEAR FORM
    // ==========================================================

    setFormData({
      zone: "",

      firstName: "",
      middleName: "",
      lastName: "",

      firstNameMarathi: "",
      middleNameMarathi: "",
      lastNameMarathi: "",

      mobileNo: "",
      aadharNo: "",
      email: "",

      address: "",
      addressMarathi: "",

      purpose: "",
      purposeMarathi: "",

      connectionNo: "",

      consumeType: "",
      meterType: "",
    });

    setDocumentFiles({});

    console.log(
      "Final Upload Results:",
      uploadResults
    );

  } catch (error) {

    console.error(
      "Water Application Submit Error:",
      error
    );

    Swal.close();

    // ==========================================================
    // GET PROPER ERROR MESSAGE
    // ==========================================================

    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Unable to submit application.";

    await Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: errorMessage,
      confirmButtonColor: "#1e3a8a",
    });

  } finally {

    setIsSubmitting(false);

  }
};
  const handleClose = () => {
    window.history.back();
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div>
      <Card className="shadow-sm border">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <CardHeader className="border-b px-4 py-2">
          <CardTitle className="text-lg font-semibold">
            Water Connection Application
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">

          {/* ====================================================
              APPLICATION DETAILS
          ==================================================== */}

          <div>
            <h4 className="text-md font-semibold mb-3">
              Application Details
            </h4>

            <hr className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

              {/* =================================================
                  ZONE
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Zone"
                    required
                  />

                  <span>:</span>

                </div>

                <Select
                  value={formData.zone}
                  onValueChange={(value) =>
                    handleChange(
                      "zone",
                      value
                    )
                  }
                  disabled={zoneLoading}
                >

                  <SelectTrigger className="w-full">

                    <SelectValue
                      placeholder={
                        zoneLoading
                          ? "Loading zones..."
                          : "-- Select Option --"
                      }
                    />

                  </SelectTrigger>

                  <SelectContent>

                    {zoneList.length > 0 ? (

                      zoneList.map(
                        (zone) => (

                          <SelectItem
                            key={
                              zone.WARDID
                            }
                            value={String(
                              zone.WARDID
                            )}
                          >
                            {
                              zone.WARDNAME
                            }
                          </SelectItem>

                        )
                      )

                    ) : (

                      !zoneLoading && (
                        <SelectItem
                          value="no-zone"
                          disabled
                        >
                          No zones available
                        </SelectItem>
                      )

                    )}

                  </SelectContent>

                </Select>

              </div>

              <div />

              {/* =================================================
                  FIRST NAME
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="First Name"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.firstName
                  }
                  onChange={(e) =>
                    handleChange(
                      "firstName",
                      e.target.value
                    )
                  }
                  placeholder="First Name"
                />

              </div>

              {/* =================================================
                  MIDDLE NAME
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Middle Name"
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.middleName
                  }
                  onChange={(e) =>
                    handleChange(
                      "middleName",
                      e.target.value
                    )
                  }
                  placeholder="Middle Name"
                />

              </div>

              {/* =================================================
                  LAST NAME
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Last Name"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.lastName
                  }
                  onChange={(e) =>
                    handleChange(
                      "lastName",
                      e.target.value
                    )
                  }
                  placeholder="Last Name"
                />

              </div>

              <div />

              {/* =================================================
                  MARATHI FIRST NAME
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="प्रथम नाव"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.firstNameMarathi
                  }
                  onChange={(e) =>
                    handleChange(
                      "firstNameMarathi",
                      e.target.value
                    )
                  }
                  placeholder="प्रथम नाव"
                />

              </div>

              {/* =================================================
                  MARATHI MIDDLE NAME
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="मधले नाव"
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.middleNameMarathi
                  }
                  onChange={(e) =>
                    handleChange(
                      "middleNameMarathi",
                      e.target.value
                    )
                  }
                  placeholder="मधले नाव"
                />

              </div>

              {/* =================================================
                  MARATHI LAST NAME
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="आडनाव"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.lastNameMarathi
                  }
                  onChange={(e) =>
                    handleChange(
                      "lastNameMarathi",
                      e.target.value
                    )
                  }
                  placeholder="आडनाव"
                />

              </div>

              {/* =================================================
                  MOBILE
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Mobile No."
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  type="text"
                  maxLength={10}
                  value={
                    formData.mobileNo
                  }
                  onChange={(e) =>
                    handleChange(
                      "mobileNo",
                      e.target.value
                    )
                  }
                  placeholder="Mobile No."
                />

              </div>

              {/* =================================================
                  AADHAR
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Aadhar Card No"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  type="text"
                  maxLength={12}
                  value={
                    formData.aadharNo
                  }
                  onChange={(e) =>
                    handleChange(
                      "aadharNo",
                      e.target.value
                    )
                  }
                  placeholder="Aadhar Card No"
                />

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Email"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  type="email"
                  value={
                    formData.email
                  }
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Email"
                />

              </div>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Address"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.address
                  }
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="Address"
                />

              </div>

              {/* =================================================
                  MARATHI ADDRESS
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="पत्ता (मराठी)"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.addressMarathi
                  }
                  onChange={(e) =>
                    handleChange(
                      "addressMarathi",
                      e.target.value
                    )
                  }
                  placeholder="पत्ता"
                />

              </div>

              {/* =================================================
                  PURPOSE
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Purpose"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.purpose
                  }
                  onChange={(e) =>
                    handleChange(
                      "purpose",
                      e.target.value
                    )
                  }
                  placeholder="Purpose"
                />

              </div>

              {/* =================================================
                  MARATHI PURPOSE
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="उद्देश (मराठी)"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.purposeMarathi
                  }
                  onChange={(e) =>
                    handleChange(
                      "purposeMarathi",
                      e.target.value
                    )
                  }
                  placeholder="उद्देश"
                />

              </div>

              {/* =================================================
                  CONNECTION NO
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Connection No"
                    required
                  />

                  <span>:</span>

                </div>

                <Input
                  value={
                    formData.connectionNo
                  }
                  onChange={(e) =>
                    handleChange(
                      "connectionNo",
                      e.target.value
                    )
                  }
                  placeholder="Connection No"
                />

              </div>

              {/* =================================================
                  CONSUME TYPE
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Consume Type"
                    required
                  />

                  <span>:</span>

                </div>

                <Select
                  value={
                    formData.consumeType
                  }
                  onValueChange={(value) =>
                    handleChange(
                      "consumeType",
                      value
                    )
                  }
                  disabled={
                    consumerTypeLoading
                  }
                >

                  <SelectTrigger className="w-full">

                    <SelectValue
                      placeholder={
                        consumerTypeLoading
                          ? "Loading..."
                          : "-- Select Option --"
                      }
                    />

                  </SelectTrigger>

                  <SelectContent>

                    {consumerTypeList.length >
                    0 ? (

                      consumerTypeList.map(
                        (consumerType) => (

                          <SelectItem
                            key={
                              consumerType.NUM_WTRCONS_ID
                            }
                            value={String(
                              consumerType.NUM_WTRCONS_ID
                            )}
                          >
                            {
                              consumerType.VAR_WTRCONS_NAME
                            }
                          </SelectItem>

                        )
                      )

                    ) : (

                      !consumerTypeLoading && (
                        <SelectItem
                          value="no-consumer-type"
                          disabled
                        >
                          No consumer types
                          available
                        </SelectItem>
                      )

                    )}

                  </SelectContent>

                </Select>

              </div>

              {/* =================================================
                  METER TYPE
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">

                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">

                  <Label
                    text="Meter Type"
                    required
                  />

                  <span>:</span>

                </div>

                <Select
                  value={
                    formData.meterType
                  }
                  onValueChange={(value) =>
                    handleChange(
                      "meterType",
                      value
                    )
                  }
                  disabled={
                    meterTypeLoading
                  }
                >

                  <SelectTrigger className="w-full">

                    <SelectValue
                      placeholder={
                        meterTypeLoading
                          ? "Loading..."
                          : "-- Select Option --"
                      }
                    />

                  </SelectTrigger>

                  <SelectContent>

                    {meterTypeList.length >
                    0 ? (

                      meterTypeList.map(
                        (meterType) => (

                          <SelectItem
                            key={
                              meterType.NUM_WTRMETER_ID
                            }
                            value={String(
                              meterType.NUM_WTRMETER_ID
                            )}
                          >
                            {
                              meterType.VAR_WTRMETER_NAME
                            }
                          </SelectItem>

                        )
                      )

                    ) : (

                      !meterTypeLoading && (
                        <SelectItem
                          value="no-meter-type"
                          disabled
                        >
                          No meter types
                          available
                        </SelectItem>
                      )

                    )}

                  </SelectContent>

                </Select>

              </div>

            </div>
          </div>

          {/* ====================================================
              DOCUMENT DETAILS
          ==================================================== */}

          <div>

            <h4 className="text-md font-semibold mb-3">
              Document Details
            </h4>

            <hr className="mb-4" />

            <div className="overflow-x-auto">

              <table className="w-full border-collapse border text-sm">

                <thead>

                  <tr className="bg-muted">

                    <th className="border px-3 py-2 text-left w-20">
                      Sr No.
                    </th>

                    <th className="border px-3 py-2 text-left">
                      Document Name
                    </th>

                    <th className="border px-3 py-2 text-left">
                      Image(jpg,png,pdf)
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* LOADING */}

                  {documentLoading && (

                    <tr>

                      <td
                        colSpan={3}
                        className="border px-3 py-6 text-center text-gray-500"
                      >
                        Loading documents...
                      </td>

                    </tr>

                  )}

                  {/* NO DOCUMENTS */}

                  {!documentLoading &&
                    documentList.length === 0 && (

                      <tr>

                        <td
                          colSpan={3}
                          className="border px-3 py-6 text-center text-gray-500"
                        >
                          No documents required
                          for this service.
                        </td>

                      </tr>

                    )}

                  {/* DOCUMENT LIST */}

                  {!documentLoading &&
                    documentList.map(
                      (document, index) => (

                        <tr
                          key={
                            document.DOCID ||
                            index
                          }
                        >

                          {/* SR NO */}

                          <td className="border px-3 py-2">
                            {index + 1}
                          </td>

                          {/* DOCUMENT NAME */}

                          <td className="border px-3 py-2">

                            <div className="flex flex-col">

                              <span className="font-medium">
                                {
                                  document.DOCNAME
                                }
                              </span>

                              {document.ENGDOCDESC && (

                                <span className="text-xs text-gray-500">
                                  {
                                    document.ENGDOCDESC
                                  }
                                </span>

                              )}

                            </div>

                          </td>

                          {/* FILE UPLOAD */}

                          <td className="border px-3 py-2">

                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={(e) =>
                                handleDocumentFileChange(
                                  document.DOCID,
                                  e.target
                                    .files?.[0] ||
                                    null
                                )
                              }
                              className="cursor-pointer"
                            />

                            {documentFiles[
                              document.DOCID
                            ] && (

                              <p className="mt-1 text-xs text-green-600">

                                Selected:{" "}

                                {
                                  documentFiles[
                                    document.DOCID
                                  ].name
                                }

                              </p>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ====================================================
              BUTTONS
          ==================================================== */}

          <div className="flex items-center justify-center gap-3 border-t pt-5">
<Button
  type="button"
  onClick={handleSubmit}
  disabled={isSubmitting}
  className="px-8 bg-teal-600 hover:bg-teal-700"
>
  {isSubmitting
    ? "Submitting..."
    : "Submit"}
</Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="px-8"
            >
              Close
            </Button>

          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default FrmWaterConnectionApplication;