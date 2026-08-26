import React, { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";
import Swal from "sweetalert2";
import { Formik, Form } from "formik";

import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const initialValues = {
  applicationType: "new",

  oldLicenseNo: "",

  shopNameEnglish: "",
  shopNameMarathi: "",
  panCardNo: "",
  contactNo: "",
  email: "",
  shopAddress: "",

  zoneNo: "",
  wardNo: "",

  tradeBusinessType: "T",
  jalanShil: "",

  tradeCategory: "",
  tradeType: "",
  rate: "",

  isManufactured: "yes",
  isOwnerDoingBusiness: "yes",

  ownerName: "",
  ownerAddress: "",
  rentAgreementWithWhom: "",

  corporationNoc: "yes",

  businessStartYear: "",

  shopActRegistrationNo: "",
  otherAdministrationRegistrationNo: "",

  usedArea: "",

  licenseType: "",
  businessPlace: "",
  illegalType: "",
  propNo: "",

  fromDate: "",
  toDate: "",

  amount: "0",

  directorAadharNo: "",
  directorName: "",
  directorContactNo: "",
  directorEmail: "",
  directorGender: "F",
  directorAddress: "",
  directorApplicantType: "",
  directorImage: null,

  declarationAccepted: false,
};

const FrmMarketEntry = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const locationState = location.state || {};

  const getContextValue = (stateValue, userValue, ...storageKeys) => {
    if (stateValue !== undefined && stateValue !== null && stateValue !== "") {
      return stateValue;
    }

    if (userValue !== undefined && userValue !== null && userValue !== "") {
      return userValue;
    }

    for (const key of storageKeys) {
      const value = sessionStorage.getItem(key);
      if (value !== null && value !== "") {
        return value;
      }
    }

    return "";
  };

  const ulbId = Number(
    getContextValue(
      locationState.ulbId ?? locationState.ULBID,
      user?.ulbId ?? user?.ULBID,
      "ulbId",
      "ULBID",
    ) || 0,
  );

  const userId = getContextValue(
    locationState.userId ?? locationState.USERID,
    user?.userId ?? user?.USERID,
    "userId",
    "USERID",
  );

  const corpId = Number(
    getContextValue(
      locationState.corpId ??
        locationState.corporationId ??
        locationState.CORPID,
      user?.corpId ?? user?.corporationId ?? user?.CORPID,
      "corpId",
      "corporationId",
      "CORPID",
    ) || 0,
  );

  const zoneId = Number(
    getContextValue(
      locationState.zoneId ?? locationState.zoneID ?? locationState.ZONEID,
      user?.zoneId ?? user?.zoneID ?? user?.ZONEID,
      "zoneId",
      "zoneID",
      "ZONEID",
    ) || 0,
  );

  const serviceId = Number(
    getContextValue(
      locationState.serviceId ??
        locationState.serviceID ??
        locationState.SERVICEID,
      user?.serviceId ?? user?.serviceID ?? user?.SERVICEID,
      "serviceId",
      "serviceID",
      "SERVICEID",
    ) || 0,
  );

  const serviceName = getContextValue(
    locationState.serviceName,
    user?.serviceName,
    "serviceName",
    "SERVICENAME",
  );

  const searchParams = new URLSearchParams(window.location.search);

  const applicationId =
    locationState.applicationId ??
    locationState.appId ??
    searchParams.get("applicationId") ??
    searchParams.get("appid") ??
    sessionStorage.getItem("applicationId") ??
    sessionStorage.getItem("appid") ??
    "";

  const [activeTab, setActiveTab] = useState("primary");
  const [tradeCategoryOptions, setTradeCategoryOptions] = useState([]);
  const [tradeTypeOptions, setTradeTypeOptions] = useState([]);
  const [tradeRows, setTradeRows] = useState([]);
  const [tradeTypeRateRows, setTradeTypeRateRows] = useState([]);
  const [documentRows, setDocumentRows] = useState([]);
  const [selfDeclareRows, setSelfDeclareRows] = useState([]);
  const [directorRows, setDirectorRows] = useState([]);

  // Master dropdown options
  const [zoneOptions] = useState([]); // No zone API was supplied.
  const [wardOptions, setWardOptions] = useState([]);
  const [licenseTypeOptions, setLicenseTypeOptions] = useState([]);
  const [applicantTypeOptions, setApplicantTypeOptions] = useState([]);
  const [businessPlaceOptions, setBusinessPlaceOptions] = useState([]);
  const [jalanShilOptions, setJalanShilOptions] = useState([]);
  const [illegalTypeOptions, setIllegalTypeOptions] = useState([]);

  const authToken =
    token ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    "";

  const axiosConfig = useMemo(
    () => ({
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    }),
    [authToken],
  );

  const getBusinessPlace = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getbusinessplace`,
        {},
        axiosConfig,
      );

      const data = response.data?.data || [];

      setBusinessPlaceOptions(
        data.map((item) => ({
          value: String(item.NUM_BUSIPLACE_ID),
          label: item.VAR_BUSIPLACE_NAME || "",
        })),
      );
    } catch (error) {
      console.error("Business Place Error:", error?.response?.data || error);
      setBusinessPlaceOptions([]);
    }
  }, [axiosConfig]);

  const getJalanShil = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getjalanshil`,
        {},
        axiosConfig,
      );

      const data = response.data?.data || [];

      setJalanShilOptions(
        data.map((item) => ({
          value: String(item.VAR_JALANSHIL_CODE || ""),
          label: item.VAR_JALANSHIL_NAME || "",
        })),
      );
    } catch (error) {
      console.error("Jalan Shil Error:", error?.response?.data || error);
      setJalanShilOptions([]);
    }
  }, [axiosConfig]);

  const getIllegalType = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getillegaltype`,
        {},
        axiosConfig,
      );

      const data = response.data?.data || [];

      setIllegalTypeOptions(
        data.map((item) => ({
          value: String(item.NUM_ILLEGAL_ID),
          label: item.VAR_ILLEGAL_NAME || "",
        })),
      );
    } catch (error) {
      console.error("Illegal Type Error:", error?.response?.data || error);
      setIllegalTypeOptions([]);
    }
  }, [axiosConfig]);

  const getApplicantType = useCallback(async () => {
    if (!ulbId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getapplicanttype`,
        { ulbId },
        axiosConfig,
      );

      const data = response.data?.data || [];

      setApplicantTypeOptions(
        data.map((item) => ({
          value: String(item.NUM_APPLITYPE_ID),
          label: item.VAR_APPLITYPE_NAME || "",
        })),
      );
    } catch (error) {
      console.error("Applicant Type Error:", error?.response?.data || error);
      setApplicantTypeOptions([]);
    }
  }, [ulbId, axiosConfig]);

  const getWard = useCallback(async () => {
    if (!ulbId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getward`,
        { ulbId },
        axiosConfig,
      );

      const data = response.data?.data || [];

      setWardOptions(
        data.map((item) => ({
          value: String(item.WARDID),
          label: item.WARDNAME || "",
        })),
      );
    } catch (error) {
      console.error("Ward Error:", error?.response?.data || error);
      setWardOptions([]);
    }
  }, [ulbId, axiosConfig]);

  const getLicenseType = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getlicensetype`,
        {},
        axiosConfig,
      );

      const data = response.data?.data || [];

      setLicenseTypeOptions(
        data.map((item) => ({
          value: String(item.NUM_LICENSETYPE_ID),
          label: item.VAR_LICENSETYPE_NAME || "",
        })),
      );
    } catch (error) {
      console.error("License Type Error:", error?.response?.data || error);
      setLicenseTypeOptions([]);
    }
  }, [axiosConfig]);

  const getTradeCategoryByJwalan = async (jwalanshilStatus, type) => {
    if (!jwalanshilStatus || !type) {
      setTradeCategoryOptions([]);
      return [];
    }

    const response = await axios.post(
      `${BASE_URL}/api/FrmMarketEntry/gettradecategorybyjwalanshil`,
      {
        jwalanshilStatus,
        type,
      },
      axiosConfig,
    );

    const options = (response.data?.data || []).map((item) => ({
      value: String(item.NUM_CATEGORY_CATGRYID),
      label: item.VAR_TRADECATEGORY_NAME || "",
    }));

    setTradeCategoryOptions(options);
    return options;
  };

  const getTradeCategory = useCallback(
    async (tradeBusinessType, jalanShil) => {
      if (!tradeBusinessType || !jalanShil) {
        setTradeCategoryOptions([]);
        return [];
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/api/FrmMarketEntry/gettradecategory`,
          {
            // API expects T/S here, not the numeric License Type master id.
            licenseType: tradeBusinessType,
            jalanShil,
          },
          axiosConfig,
        );

        const data = response.data?.data || [];

        setTradeCategoryOptions(
          data.map((item) => ({
            value: String(item.NUM_CATEGORY_CATGRYID),
            label: item.VAR_TRADECATEGORY_NAME || "",
          })),
        );

        return data;
      } catch (error) {
        console.error("Trade Category Error:", error?.response?.data || error);
        setTradeCategoryOptions([]);
        return [];
      }
    },
    [axiosConfig],
  );

  const getTradeDetails = useCallback(async () => {
    if (!ulbId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/gettradedetails`,
        {
          ulbId,
        },
        axiosConfig,
      );

      console.log("Trade Details:", response.data);

      const data = response.data?.data || [];

      setTradeRows(
        data.map((item) => ({
          id: String(item.TRADEID),
          tradeId: String(item.TRADEID),
          tradeName: item.TRADENAME || "",
          flag: item.FLAG || "N",
          checked: item.FLAG === "Y",
        })),
      );
    } catch (error) {
      console.error("Trade Details Error:", error?.response?.data || error);

      setTradeRows([]);
    }
  }, [ulbId, axiosConfig]);

  const getDocumentDetails = useCallback(async () => {
    if (!ulbId || !serviceId) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getdocumentdetails`,
        {
          serviceId,
          ulbId,
        },
        axiosConfig,
      );

      console.log("Document Details:", response.data);

      const data = response.data?.data || [];

      setDocumentRows(
        data.map((item, index) => ({
          id: String(item.DOCID),

          srNo: index + 1,

          docId: String(item.DOCID),

          documentName: item.DOCTYPENAME || "",

          documentType: item.DOCTYPE || "",

          engDescription: item.ENGDOCDESC || "",

          active: item.ACTIVE || "N",

          file: null,

          fileName: "",
        })),
      );
    } catch (error) {
      console.error("Document Details Error:", error?.response?.data || error);

      setDocumentRows([]);
    }
  }, [ulbId, serviceId, axiosConfig]);

  const getSelfDeclare = useCallback(async () => {
    if (!serviceId) {
      setSelfDeclareRows([]);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getselfdeclaredata`,
        {
          serviceId: Number(serviceId),
        },
        axiosConfig,
      );

      console.log("Self Declare Response:", response.data);

      const data = response.data?.data || [];

      setSelfDeclareRows(
        data.map((item) => ({
          id: String(item.ID ?? ""),
          message: item.MESSAGE ?? "",
        })),
      );
    } catch (error) {
      console.error("Self Declare Error:", error?.response?.data || error);

      setSelfDeclareRows([]);
    }
  }, [serviceId, axiosConfig]);

  const getApplicationDetails = useCallback(
    async (appId) => {
      if (!appId || !ulbId) return null;

      try {
        const response = await axios.post(
          `${BASE_URL}/api/FrmMarketEntry/getapplicationdetails`,
          {
            applicationId: Number(appId),
            ulbId,
            serviceId,
          },
          axiosConfig,
        );

        console.log("Application Details:", response.data);

        return response.data?.data || null;
      } catch (error) {
        console.error(
          "Application Details Error:",
          error?.response?.data || error,
        );
        return null;
      }
    },
    [ulbId, serviceId, axiosConfig],
  );

  useEffect(() => {
    if (!ulbId || !serviceId) {
      console.warn("Required dynamic ULB or Service ID is not available", {
        ulbId,
        serviceId,
      });
      return;
    }

    const loadData = async () => {
      const appId = applicationId;

      Swal.fire({
        title: "Loading...",
        text: "Loading Market Entry details",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const results = await Promise.allSettled([
          getBusinessPlace(),
          getJalanShil(),
          getIllegalType(),
          getApplicantType(),
          getWard(),
          getLicenseType(),
          getTradeDetails(),
          getDocumentDetails(),
          getSelfDeclare(),
          appId ? getApplicationDetails(appId) : Promise.resolve(null),
        ]);

        const applicationResult = results[9];
        const applicationData =
          applicationResult?.status === "fulfilled"
            ? applicationResult.value
            : null;

        if (applicationData?.application) {
          const application = applicationData.application;

          setTradeTypeOptions(
            (applicationData.tradeTypeDetails || []).map((item) => ({
              value: String(
                item.NUM_APPLITRADETYPE_TRDTYPID || item.TRADETYPEID || "",
              ),
              label: item.TRADETYPE || "",
            })),
          );

          setTradeTypeRateRows(
            (applicationData.tradeTypeDetails || []).map((item) => ({
              id: item.NUM_APPLITRADETYPE_ID || Date.now(),
              tradeTypeId: String(
                item.NUM_APPLITRADETYPE_TRDTYPID || item.TRADETYPEID || "",
              ),
              tradeType: item.TRADETYPE || "",
              rate: String(item.RATE || 0),
              tradeCategoryId: "",
              tradeCategory: "",
            })),
          );

          setDirectorRows(
            (applicationData.directorDetails || []).map((item) => ({
              id: item.DIRECTORID || Date.now(),
              aadharNo: item.ADHARNO != null ? String(item.ADHARNO) : "",
              directorName: item.DIRCTORNAME || "",
              mobileNo: item.MOBILENO != null ? String(item.MOBILENO) : "",
              email: item.EMAIL || "",
              gender: item.GENDER || "",
              address: item.ADDRESS || "",
              applicantTypeId:
                item.APPLITYPEID != null ? String(item.APPLITYPEID) : "",
              applicantType: item.APPLITYPENAME || "",
              image: null,
            })),
          );
        }
      } finally {
        Swal.close();
      }
    };

    loadData();
  }, [
    ulbId,
    corpId,
    zoneId,
    serviceId,
    applicationId,
    getBusinessPlace,
    getJalanShil,
    getIllegalType,
    getApplicantType,
    getWard,
    getLicenseType,
    getTradeDetails,
    getDocumentDetails,
    getSelfDeclare,
    getApplicationDetails,
  ]);

  const handleTradeCheck = (tradeId, checked) => {
    setTradeRows((previous) =>
      previous.map((item) =>
        String(item.tradeId) === String(tradeId)
          ? {
              ...item,
              checked,
            }
          : item,
      ),
    );
  };

  const allTradesSelected =
    tradeRows.length > 0 && tradeRows.every((item) => item.checked);

  const handleSelectAll = (checked) => {
    setTradeRows((previous) =>
      previous.map((item) => ({
        ...item,
        checked,
      })),
    );
  };

  const getTradeTypeRates = async (tradeTypes, fromDate, toDate) => {
    if (!tradeTypes?.length || !fromDate || !toDate || !ulbId) {
      return [];
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/gettradtypesrates`,
        {
          tradeTypes: tradeTypes.join(","),
          fromDate,
          toDate,
          ulbId,
        },
        axiosConfig,
      );

      console.log("Trade Type Rates:", response.data);

      return response.data?.data || [];
    } catch (error) {
      console.error("Trade Type Rate Error:", error?.response?.data || error);

      return [];
    }
  };

  const addTradeType = async (values, setFieldValue) => {
    if (!values.tradeCategory) {
      Swal.fire({
        icon: "warning",
        text: "Please select Trade Category",
      });
      return;
    }

    if (!values.tradeType) {
      Swal.fire({
        icon: "warning",
        text: "Please select Trade Type",
      });
      return;
    }

    const alreadyExists = tradeTypeRateRows.some(
      (item) => String(item.tradeTypeId) === String(values.tradeType),
    );

    if (alreadyExists) {
      Swal.fire({
        icon: "warning",
        text: "Trade Type already added.",
      });
      return;
    }

    let rate = values.rate || "0";

    if (values.fromDate && values.toDate) {
      const rates = await getTradeTypeRates(
        [values.tradeType],
        formatDateForApi(values.fromDate),
        formatDateForApi(values.toDate),
      );

      const selectedRate = rates.find(
        (item) => String(item.NUM_RATE_ID) === String(values.tradeType),
      );

      if (selectedRate) {
        rate = String(selectedRate.TRADTYPE_RATE || 0);
      }
    }

    const category = tradeCategoryOptions.find(
      (item) => String(item.value) === String(values.tradeCategory),
    );

    const tradeType = tradeTypeOptions.find(
      (item) => String(item.value) === String(values.tradeType),
    );

    setTradeTypeRateRows((previous) => [
      ...previous,
      {
        id: Date.now(),

        tradeTypeId: values.tradeType,

        tradeType: tradeType?.label || "",

        tradeCategoryId: values.tradeCategory,

        tradeCategory: category?.label || "",

        rate,
      },
    ]);

    setFieldValue("tradeType", "");

    setFieldValue("rate", "");
  };

  const removeTradeType = (id) => {
    setTradeTypeRateRows((previous) =>
      previous.filter((item) => item.id !== id),
    );
  };

  const addDirector = (values, setFieldValue) => {
    if (!values.directorAadharNo) {
      Swal.fire({
        icon: "warning",
        text: "Please enter Aadhar No.",
      });
      return;
    }

    if (!values.directorName) {
      Swal.fire({
        icon: "warning",
        text: "Please enter Director Name.",
      });
      return;
    }

    if (!values.directorContactNo) {
      Swal.fire({
        icon: "warning",
        text: "Please enter Mobile No.",
      });
      return;
    }

    if (!values.directorEmail) {
      Swal.fire({
        icon: "warning",
        text: "Please enter Email.",
      });
      return;
    }

    if (!values.directorAddress) {
      Swal.fire({
        icon: "warning",
        text: "Please enter Address.",
      });
      return;
    }

    const applicantType = applicantTypeOptions.find(
      (item) => String(item.value) === String(values.directorApplicantType),
    );

    setDirectorRows((previous) => [
      ...previous,
      {
        id: Date.now(),

        aadharNo: values.directorAadharNo,

        directorName: values.directorName,

        mobileNo: values.directorContactNo,

        email: values.directorEmail,

        gender: values.directorGender,

        address: values.directorAddress,

        applicantTypeId: values.directorApplicantType,

        applicantType: applicantType?.label || "",

        image: values.directorImage,
      },
    ]);

    setFieldValue("directorAadharNo", "");

    setFieldValue("directorName", "");

    setFieldValue("directorContactNo", "");

    setFieldValue("directorEmail", "");

    setFieldValue("directorAddress", "");

    setFieldValue("directorApplicantType", "");

    setFieldValue("directorImage", null);
  };

  const removeDirector = (id) => {
    setDirectorRows((previous) => previous.filter((item) => item.id !== id));
  };

  const handleDocumentFile = (id, file) => {
    if (!file) return;

    setDocumentRows((previous) =>
      previous.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              file,
              fileName: file.name,
            }
          : item,
      ),
    );
  };

  const buildDirectorString = () => {
    return directorRows
      .map((item, index) =>
        [
          index + 1,
          item.directorName || "",
          item.aadharNo || "",
          item.address || "",
          item.mobileNo || "",
          item.email || "",
          item.gender || "",
          item.applicantTypeId || "",
          item.voterId || "",
        ].join("$"),
      )
      .join("#");
  };

  const getExistingLicense = async (oldLicenseNo, setFieldValue) => {
    if (!oldLicenseNo) {
      Swal.fire({
        icon: "warning",
        text: "Please enter Old License No.",
      });

      return;
    }

    try {
      Swal.fire({
        title: "Loading...",
        text: "Fetching existing license details",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/getexistinglicensedetails`,
        {
          oldLicencNo: oldLicenseNo,
          ulbId,
        },
        axiosConfig,
      );

      Swal.close();

      console.log("Existing License:", response.data);

      const result = response.data?.data;

      if (!response.data?.success || !result?.found) {
        Swal.fire({
          icon: "warning",
          text: response.data?.message || "License details not found.",
        });

        return;
      }

      const application = result.application;

      setFieldValue("applicationType", "renewal");

      setTradeTypeOptions(
        (result.tradeTypeDetails || []).map((item) => ({
          value: String(
            item.NUM_APPLITRADETYPE_TRDTYPID || item.TRADETYPEID || "",
          ),
          label: item.TRADETYPE || "",
        })),
      );

      if (application) {
        setFieldValue(
          "oldLicenseNo",
          application.VAR_APPLI_OLDLICENCNO || oldLicenseNo,
        );

        setFieldValue("shopNameEnglish", application.VAR_APPLI_SHOPNAME || "");

        setFieldValue(
          "shopNameMarathi",
          application.VAR_APPLI_SHOPNAMEMAR || "",
        );

        setFieldValue("panCardNo", application.VAR_APPLI_PANNO || "");

        setFieldValue(
          "contactNo",
          application.NUM_APPLI_CONTACTNO != null
            ? String(application.NUM_APPLI_CONTACTNO)
            : "",
        );

        setFieldValue("email", application.VAR_APPLI_EMAIL || "");

        setFieldValue("shopAddress", application.VAR_APPLI_ADDRESS || "");

        setFieldValue(
          "zoneNo",
          application.NUM_APPLI_ZONEID != null
            ? String(application.NUM_APPLI_ZONEID)
            : "",
        );

        setFieldValue(
          "wardNo",
          application.NUM_APPLI_WARDID != null
            ? String(application.NUM_APPLI_WARDID)
            : "",
        );

        setFieldValue(
          "usedArea",
          application.NUM_APPLI_AREA != null
            ? String(application.NUM_APPLI_AREA)
            : "",
        );

        setFieldValue("ownerName", application.VAR_APPLI_PLACEOWNERNAME || "");

        setFieldValue(
          "ownerAddress",
          application.VAR_APPLI_PLACEOWNERADDRESS || "",
        );

        setFieldValue(
          "rentAgreementWithWhom",
          application.VAR_APPLI_AGRMENTWITH || "",
        );

        setFieldValue(
          "businessStartYear",
          application.NUM_APPLI_BUSSTARTYR != null
            ? String(application.NUM_APPLI_BUSSTARTYR)
            : "",
        );

        setFieldValue(
          "shopActRegistrationNo",
          application.VAR_APPLI_SHOPACTNO || "",
        );

        setFieldValue(
          "otherAdministrationRegistrationNo",
          application.VAR_APPLI_FOODLICNO || "",
        );

        setFieldValue(
          "corporationNoc",
          application.VAR_APPLI_ISCORPNOC === "Y" ? "yes" : "no",
        );

        setFieldValue(
          "isManufactured",
          application.VAR_APPLI_ISPROD === "Y" ? "yes" : "no",
        );

        setFieldValue(
          "isOwnerDoingBusiness",
          application.VAR_APPLI_OWNSPACE === "Y" ? "yes" : "no",
        );

        setFieldValue(
          "amount",
          application.AMOUNT != null ? String(application.AMOUNT) : "0",
        );

        setFieldValue(
          "licenseType",
          application.NUM_APPLI_LICENSETYPEID != null
            ? String(application.NUM_APPLI_LICENSETYPEID)
            : "",
        );

        setFieldValue(
          "fromDate",
          formatDateForInput(application.DAT_APPLI_FROMDT),
        );

        setFieldValue("toDate", formatDateForInput(application.DAT_APPLI_TODT));
      }

      const existingTradeIds = (result.tradeDetails || []).map((item) =>
        String(item.NUM_APPLITRADE_TRADEID),
      );

      setTradeRows((previous) =>
        previous.map((item) => ({
          ...item,
          checked: existingTradeIds.includes(String(item.tradeId)),
        })),
      );

      setTradeTypeRateRows(
        (result.tradeTypeDetails || []).map((item) => ({
          id: item.NUM_APPLITRADETYPE_ID,

          tradeTypeId: String(
            item.NUM_APPLITRADETYPE_TRDTYPID || item.TRADETYPEID || "",
          ),

          tradeType: item.TRADETYPE || "",

          rate: String(item.RATE || 0),

          tradeCategoryId: "",

          tradeCategory: "",
        })),
      );

      setDirectorRows(
        (result.directorDetails || []).map((item) => ({
          id: item.DIRECTORID || Date.now(),

          aadharNo: item.ADHARNO != null ? String(item.ADHARNO) : "",

          directorName: item.DIRCTORNAME || "",

          mobileNo: item.MOBILENO != null ? String(item.MOBILENO) : "",

          email: item.EMAIL || "",

          gender: item.GENDER || "",

          address: item.ADDRESS || "",

          applicantTypeId:
            item.APPLITYPEID != null ? String(item.APPLITYPEID) : "",

          applicantType: item.APPLITYPENAME || "",

          image: null,
        })),
      );

      Swal.fire({
        icon: "success",
        text: "Existing license details fetched successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.close();

      console.error("Existing License Error:", error?.response?.data || error);

      Swal.fire({
        icon: "error",
        text:
          error?.response?.data?.message ||
          "Unable to fetch existing license details.",
      });
    }
  };

  const checkLicenseCancelled = async (oldLicenseNo) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/checklicensecancelled`,
        {
          oldLicencNo: oldLicenseNo,
        },
        axiosConfig,
      );

      console.log("Cancelled Response:", response.data);

      if (response.data?.cancelled) {
        Swal.fire({
          icon: "error",
          text: response.data?.message || "License is Cancelled.",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error("Cancelled Check Error:", error?.response?.data || error);

      Swal.fire({
        icon: "error",
        text: "Unable to check license status.",
      });

      return true;
    }
  };

  const submitApplication = async (values, { setSubmitting, resetForm }) => {
    try {
      if (!ulbId || !userId || !serviceId) {
        Swal.fire({
          icon: "warning",
          text: "Required ULB, User, or Service ID is not available.",
        });

        return;
      }

      if (!values.shopNameEnglish) {
        Swal.fire({
          icon: "warning",
          text: "Please enter Shop Name.",
        });

        setActiveTab("primary");

        return;
      }

      if (selfDeclareRows.length > 0 && !values.declarationAccepted) {
        Swal.fire({
          icon: "warning",
          text: "Please accept the self declaration before submitting.",
        });

        setActiveTab("primary");
        return;
      }

      const selectedTrades = tradeRows.filter((item) => item.checked);

      if (selectedTrades.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "Please select at least one Trade.",
        });

        return;
      }

      const tradeString = selectedTrades.map((item) => item.tradeId).join("#");

      const tradeTypeString = tradeTypeRateRows
        .map((item) => `${item.tradeTypeId}$${item.rate}`)
        .join("#");

      const payload = {
        userId: String(userId || ""),
        corpId,
        zoneId: values.zoneNo ? Number(values.zoneNo) : zoneId || 0,
        appid: applicationId ? Number(applicationId) : 0,

        appliNo: "",

        mode: values.applicationType === "renewal" ? 2 : 1,

        oldLicencNo: values.oldLicenseNo || null,

        shopName: values.shopNameEnglish,

        panNo: values.panCardNo,

        contactNo: values.contactNo ? Number(values.contactNo) : null,

        email: values.email,

        address: values.shopAddress,

        wardId: values.wardNo ? Number(values.wardNo) : 0,

        isProd: values.isManufactured === "yes" ? "Y" : "N",

        ownSpace: values.isOwnerDoingBusiness === "yes" ? "Y" : "N",

        agrmentWith: values.rentAgreementWithWhom,

        area: values.usedArea ? Number(values.usedArea) : 0,

        isCorpNOC: values.corporationNoc === "yes" ? "Y" : "N",

        busStartYr: values.businessStartYear
          ? Number(values.businessStartYear)
          : 0,

        shopActNo: values.shopActRegistrationNo,

        foodlicno: values.otherAdministrationRegistrationNo,

        licDays: null,

        applitradeStr: tradeString,

        applitradetypeStr: tradeTypeString,

        applidirectorStr: buildDirectorString(),

        source: "WEB",

        shopNameMar: values.shopNameMarathi,

        placeOwnerName: values.ownerName,

        placeOwnerAddress: values.ownerAddress,

        fromDate: values.fromDate || null,

        toDate: values.toDate || null,

        amount: Number(
          tradeTypeRateRows.reduce(
            (total, item) => total + Number(item.rate || 0),
            0,
          ),
        ),

        licType: values.applicationType === "renewal" ? "2" : "1",

        ulbId,

        ipAddress: "127.0.0.1",

        licenseTypeId: values.licenseType ? Number(values.licenseType) : 0,

        arrearsAmount: 0,

        serviceId,

        cfcRecno: "",

        jwalan: values.jalanShil,

        illegal: values.illegalType ? Number(values.illegalType) : 0,

        businessPlace: values.businessPlace ? Number(values.businessPlace) : 0,

        category: values.tradeCategory,

        propNo: values.propNo || "",

        trdBusinessType: values.tradeBusinessType,
      };

      console.log("APPLICATION ENTRY PAYLOAD:", payload);

      Swal.fire({
        title: "Saving...",
        text: "Submitting application",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${BASE_URL}/api/FrmMarketEntry/applicationentry`,
        payload,
        axiosConfig,
      );

      Swal.close();

      console.log("APPLICATION ENTRY RESPONSE:", response.data);

      if (response.data?.success || response.data?.ok) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data?.message || "Application submitted successfully.",
        });

        resetForm();

        setTradeRows((previous) =>
          previous.map((item) => ({
            ...item,
            checked: false,
          })),
        );

        setTradeTypeRateRows([]);

        setDirectorRows([]);

        setActiveTab("primary");
      } else {
        Swal.fire({
          icon: "error",
          text: response.data?.message || "Application submission failed.",
        });
      }
    } catch (error) {
      Swal.close();

      console.error("Application Entry Error:", error?.response?.data || error);

      Swal.fire({
        icon: "error",
        text: error?.response?.data?.message || "Unable to submit application.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateForInput = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const parseDateForPicker = (value) => {
    if (!value) return undefined;

    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? undefined : value;
    }

    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  const formatDateForFormik = (date) => {
    if (!date || Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <Formik initialValues={initialValues} onSubmit={submitApplication}>
      {({ values, setFieldValue, resetForm, isSubmitting }) => {
        return (
          <Form className="w-full">
            <Card className="w-full rounded-xl border border-gray-300 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl font-bold">
                  Market Entry
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <div className="px-4 pt-4 sm:px-6">
                    <TabsList className="w-full justify-start overflow-x-auto">
                      <TabsTrigger value="primary">प्राथमिक माहिती</TabsTrigger>

                      <TabsTrigger value="director">संचालक माहिती</TabsTrigger>

                      <TabsTrigger value="documents">
                        कागदपत्र जोडणे
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* =================================================
                    PRIMARY TAB
                ================================================== */}

                  <TabsContent value="primary" className="px-4 py-5 sm:px-6">
                    {/* APPLICATION TYPE */}

                    <div className="mb-6 flex justify-center gap-6">
                      <label className="flex items-center gap-2">
                        <Input
                          type="radio"
                          checked={values.applicationType === "new"}
                          onChange={() =>
                            setFieldValue("applicationType", "new")
                          }
                          className="h-4 w-4"
                        />

                        <span>New</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <Input
                          type="radio"
                          checked={values.applicationType === "renewal"}
                          onChange={() =>
                            setFieldValue("applicationType", "renewal")
                          }
                          className="h-4 w-4"
                        />

                        <span>Renewal</span>
                      </label>
                    </div>

                    {/* OLD LICENSE */}

                    {values.applicationType === "renewal" && (
                      <div className="mb-6  p-2">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                          <div className="flex shrink-0 items-start md:w-[300px]">
                            <Label
                              text="जुना परवाना क्रमांक"
                              className="!w-full text-[15px] font-medium sm:text-[14px]"
                            />

                            <span className="ml-4 hidden md:block">:</span>
                          </div>

                          <div className="flex w-full flex-1 items-center gap-3 md:max-w-[750px]">
                            <Input
                              value={values.oldLicenseNo}
                              onChange={(e) =>
                                setFieldValue("oldLicenseNo", e.target.value)
                              }
                              className="h-10 w-full"
                            />

                            <Button
                              type="button"
                              className="h-10 shrink-0 px-6"
                              onClick={async () => {
                                const cancelled = await checkLicenseCancelled(
                                  values.oldLicenseNo,
                                );

                                if (!cancelled) {
                                  await getExistingLicense(
                                    values.oldLicenseNo,
                                    setFieldValue,
                                  );
                                }
                              }}
                            >
                              शोधा
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BASIC DETAILS */}

                    <div className="grid w-full grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-2">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="दुकानाचे नाव इंग्रजी"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          value={values.shopNameEnglish}
                          onChange={(e) =>
                            setFieldValue("shopNameEnglish", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="दुकानाचे नाव मराठी"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          value={values.shopNameMarathi}
                          onChange={(e) =>
                            setFieldValue("shopNameMarathi", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="पॅन कार्ड नं."
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          maxLength={10}
                          value={values.panCardNo}
                          onChange={(e) =>
                            setFieldValue(
                              "panCardNo",
                              e.target.value.toUpperCase(),
                            )
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="संपर्क क्र."
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          type="tel"
                          maxLength={10}
                          value={values.contactNo}
                          onChange={(e) =>
                            setFieldValue(
                              "contactNo",
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="ई-मेल"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          type="email"
                          value={values.email}
                          onChange={(e) =>
                            setFieldValue("email", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="दुकानाचा पत्ता"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          value={values.shopAddress}
                          onChange={(e) =>
                            setFieldValue("shopAddress", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      {/* ZONE */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="झोन क्र."
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.zoneNo}
                          onValueChange={(value) =>
                            setFieldValue("zoneNo", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {zoneOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* WARD */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="वार्ड क्र."
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.wardNo}
                          onValueChange={(value) =>
                            setFieldValue("wardNo", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {wardOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* TRADE BUSINESS TYPE */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="व्यवसायाचा प्रकार"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <div className="flex flex-wrap gap-5">
                          <label className="flex items-center gap-2">
                            <Input
                              type="radio"
                              checked={values.tradeBusinessType === "T"}
                              onChange={async () => {
                                setFieldValue("tradeBusinessType", "T");

                                setFieldValue("tradeCategory", "");

                                setFieldValue("tradeType", "");

                                if (values.jalanShil) {
                                  await getTradeCategoryByJwalan(
                                    values.jalanShil,
                                    "T",
                                  );
                                }
                              }}
                              className="h-4 w-4"
                            />
                            Trade
                          </label>

                          <label className="flex items-center gap-2">
                            <Input
                              type="radio"
                              checked={values.tradeBusinessType === "S"}
                              onChange={async () => {
                                setFieldValue("tradeBusinessType", "S");

                                setFieldValue("tradeCategory", "");

                                setFieldValue("tradeType", "");

                                if (values.jalanShil) {
                                  await getTradeCategoryByJwalan(
                                    values.jalanShil,
                                    "S",
                                  );
                                }
                              }}
                              className="h-4 w-4"
                            />
                            Storage
                          </label>
                        </div>
                      </div>

                      {/* JWALAN SHIL */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="ज्वलनशील पदार्थांचा / इंधनाचा वापर व साठवणूक करीत आहे?"
                          required
                          className="!w-full text-[14px] font-medium leading-5"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.jalanShil}
                          onValueChange={async (value) => {
                            setFieldValue("jalanShil", value);

                            setFieldValue("tradeCategory", "");

                            setFieldValue("tradeType", "");

                            await getTradeCategory(
                              values.tradeBusinessType,
                              value,
                            );
                          }}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {jalanShilOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* TRADE CATEGORY */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="Trade Category"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.tradeCategory}
                          disabled={
                            !values.tradeBusinessType || !values.jalanShil
                          }
                          onValueChange={(value) => {
                            setFieldValue("tradeCategory", value);

                            setFieldValue("tradeType", "");

                            setFieldValue("rate", "");
                          }}
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select Trade Category" />
                          </SelectTrigger>

                          <SelectContent>
                            {tradeCategoryOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* LICENSE TYPE */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="License Type"
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.licenseType}
                          onValueChange={(value) =>
                            setFieldValue("licenseType", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {licenseTypeOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* BUSINESS PLACE */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="व्यवसायाची जागा"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.businessPlace}
                          onValueChange={(value) =>
                            setFieldValue("businessPlace", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {businessPlaceOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* ILLEGAL PROPERTY */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="Illegal Property"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.illegalType}
                          onValueChange={(value) =>
                            setFieldValue("illegalType", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {illegalTypeOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* PROPERTY NO */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="Property No"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          value={values.propNo}
                          onChange={(e) =>
                            setFieldValue("propNo", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      {/* SHOP ACT */}

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="शॉप अक्ट नोंदणी क्र."
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          value={values.shopActRegistrationNo}
                          onChange={(e) =>
                            setFieldValue(
                              "shopActRegistrationNo",
                              e.target.value,
                            )
                          }
                          className="h-10 w-full"
                        />
                      </div>
                    </div>

                    {/* TRADE TYPE SECTION */}

                    <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-2">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="Trade Type"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.tradeType}
                          disabled={!values.tradeCategory}
                          onValueChange={(value) =>
                            setFieldValue("tradeType", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {tradeTypeOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="Rate"
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          type="number"
                          value={values.rate}
                          onChange={(e) =>
                            setFieldValue("rate", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="From Date"
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <DatePicker
                          value={parseDateForPicker(values.fromDate)}
                          onChange={(date) =>
                            setFieldValue("fromDate", formatDateForFormik(date))
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="To Date"
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <DatePicker
                          value={parseDateForPicker(values.toDate)}
                          onChange={(date) =>
                            setFieldValue("toDate", formatDateForFormik(date))
                          }
                          className="h-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <Button
                        type="button"
                        onClick={() => addTradeType(values, setFieldValue)}
                      >
                        Add To List
                      </Button>
                    </div>

                    {/* TRADE TYPE TABLE */}

                    {tradeTypeRateRows.length > 0 && (
                      <div className="w-full">
                        <Table className="w-full table-fixed border">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[80px] bg-[#184aa6] text-center text-white">
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={allTradesSelected}
                                    onCheckedChange={(checked) =>
                                      handleSelectAll(checked === true)
                                    }
                                  />
                                </div>
                              </TableHead>

                              <TableHead className="w-full bg-[#184aa6] text-center text-white">
                                Trade
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {tradeRows.length > 0 ? (
                              tradeRows.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="w-[80px] text-center">
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={item.checked}
                                        onCheckedChange={(checked) =>
                                          handleTradeCheck(
                                            item.tradeId,
                                            checked === true,
                                          )
                                        }
                                      />
                                    </div>
                                  </TableCell>

                                  <TableCell className="w-full text-left">
                                    {item.tradeName}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  className="py-5 text-center"
                                >
                                  No Trade Details Found
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {/* BUSINESS DETAILS */}

                    <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 xl:grid-cols-2">
                      <div>
                        <h2 className="mb-5 text-center text-xl font-bold">
                          व्यवसायाचे स्वरूप
                        </h2>

                        <div className="space-y-5">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="वस्तू निर्मित आहे का"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <div className="flex gap-5">
                              <label className="flex items-center gap-2">
                                <Input
                                  type="radio"
                                  checked={values.isManufactured === "yes"}
                                  onChange={() =>
                                    setFieldValue("isManufactured", "yes")
                                  }
                                  className="h-4 w-4"
                                />
                                होय
                              </label>

                              <label className="flex items-center gap-2">
                                <Input
                                  type="radio"
                                  checked={values.isManufactured === "no"}
                                  onChange={() =>
                                    setFieldValue("isManufactured", "no")
                                  }
                                  className="h-4 w-4"
                                />
                                नाही
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="जागा मालकाचे नाव"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <Input
                              value={values.ownerName}
                              onChange={(e) =>
                                setFieldValue("ownerName", e.target.value)
                              }
                              className="h-10 w-full"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="भाडे करार कोणासोबत केले आहे"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <Input
                              value={values.rentAgreementWithWhom}
                              onChange={(e) =>
                                setFieldValue(
                                  "rentAgreementWithWhom",
                                  e.target.value,
                                )
                              }
                              className="h-10 w-full"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="म.न.पा. नाहरकत प्रमाणपत्र"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <div className="flex gap-5">
                              <label className="flex items-center gap-2">
                                <Input
                                  type="radio"
                                  checked={values.corporationNoc === "yes"}
                                  onChange={() =>
                                    setFieldValue("corporationNoc", "yes")
                                  }
                                  className="h-4 w-4"
                                />
                                होय
                              </label>

                              <label className="flex items-center gap-2">
                                <Input
                                  type="radio"
                                  checked={values.corporationNoc === "no"}
                                  onChange={() =>
                                    setFieldValue("corporationNoc", "no")
                                  }
                                  className="h-4 w-4"
                                />
                                नाही
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="व्यवसाय सुरू केल्याचे वर्ष"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <Input
                              value={values.businessStartYear}
                              onChange={(e) =>
                                setFieldValue(
                                  "businessStartYear",
                                  e.target.value,
                                )
                              }
                              className="h-10 w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* BUSINESS */}

                      <div>
                        <h2 className="mb-5 text-center text-xl font-bold">
                          व्यवसाय
                        </h2>

                        <div className="w-full overflow-x-auto">
                          <Table className="min-w-[500px] border">
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-20 bg-[#184aa6] text-center text-white">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={allTradesSelected}
                                      onCheckedChange={(checked) =>
                                        handleSelectAll(checked === true)
                                      }
                                    />
                                  </div>
                                </TableHead>

                                <TableHead className="bg-[#184aa6] text-white">
                                  Trade
                                </TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                              {tradeRows.length > 0 ? (
                                tradeRows.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell className="text-center">
                                      <div className="flex justify-center">
                                        <Checkbox
                                          checked={item.checked}
                                          onCheckedChange={(checked) =>
                                            handleTradeCheck(
                                              item.tradeId,
                                              checked === true,
                                            )
                                          }
                                        />
                                      </div>
                                    </TableCell>

                                    <TableCell>{item.tradeName}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={2}
                                    className="py-5 text-center"
                                  >
                                    No Trade Details Found
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="mt-5 space-y-5">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="स्वतःच्या मालकीच्या जागेत व्यवसाय करीत आहे का"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <div className="flex gap-5">
                              <label className="flex items-center gap-2">
                                <Input
                                  type="radio"
                                  checked={
                                    values.isOwnerDoingBusiness === "yes"
                                  }
                                  onChange={() =>
                                    setFieldValue("isOwnerDoingBusiness", "yes")
                                  }
                                  className="h-4 w-4"
                                />
                                होय
                              </label>

                              <label className="flex items-center gap-2">
                                <Input
                                  type="radio"
                                  checked={values.isOwnerDoingBusiness === "no"}
                                  onChange={() =>
                                    setFieldValue("isOwnerDoingBusiness", "no")
                                  }
                                  className="h-4 w-4"
                                />
                                नाही
                              </label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="जागा मालकाचा पत्ता"
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <Input
                              value={values.ownerAddress}
                              onChange={(e) =>
                                setFieldValue("ownerAddress", e.target.value)
                              }
                              className="h-10 w-full"
                            />
                          </div>

                          <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                            <Label
                              text="वापरात आलेले क्षेत्र चौ. फु."
                              className="!w-full text-[14px] font-medium"
                            />

                            <span className="hidden md:block">:</span>

                            <Input
                              type="number"
                              value={values.usedArea}
                              onChange={(e) =>
                                setFieldValue("usedArea", e.target.value)
                              }
                              className="h-10 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SELF DECLARATION */}

                    {selfDeclareRows.length > 0 && (
                      <div className="mt-8 rounded-lg border bg-gray-50 p-5">
                        <h3 className="mb-4 font-semibold">स्वयंघोषणा</h3>

                        {selfDeclareRows.map((item) => (
                          <p key={item.id} className="text-sm leading-7">
                            {item.message}
                          </p>
                        ))}

                        <div className="mt-4 flex items-start gap-2">
                          <Checkbox
                            checked={values.declarationAccepted}
                            onCheckedChange={(checked) =>
                              setFieldValue(
                                "declarationAccepted",
                                checked === true,
                              )
                            }
                          />

                          <span className="text-sm">
                            मी वरील घोषणा वाचली असून ती मला मान्य आहे.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* BUTTONS */}

                    <div className="mt-7 flex flex-col justify-center gap-3 border-t pt-5 sm:flex-row">
                      <Button
                        type="button"
                        onClick={() => setActiveTab("director")}
                      >
                        पुढे जा
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => resetForm()}
                      >
                        रिसेट करा
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="director" className="px-4 py-5 sm:px-6">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-2">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="संचालकांचा आधार क्रमांक"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          maxLength={12}
                          value={values.directorAadharNo}
                          onChange={(e) =>
                            setFieldValue(
                              "directorAadharNo",
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="संचालकांचे नाव"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          value={values.directorName}
                          onChange={(e) =>
                            setFieldValue("directorName", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="संपर्क क्र."
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          maxLength={10}
                          value={values.directorContactNo}
                          onChange={(e) =>
                            setFieldValue(
                              "directorContactNo",
                              e.target.value.replace(/\D/g, ""),
                            )
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="ई-मेल"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          type="email"
                          value={values.directorEmail}
                          onChange={(e) =>
                            setFieldValue("directorEmail", e.target.value)
                          }
                          className="h-10 w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="लिंग"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <div className="flex flex-wrap gap-5">
                          <label className="flex items-center gap-2">
                            <Input
                              type="radio"
                              checked={values.directorGender === "F"}
                              onChange={() =>
                                setFieldValue("directorGender", "F")
                              }
                              className="h-4 w-4"
                            />
                            स्त्री
                          </label>

                          <label className="flex items-center gap-2">
                            <Input
                              type="radio"
                              checked={values.directorGender === "M"}
                              onChange={() =>
                                setFieldValue("directorGender", "M")
                              }
                              className="h-4 w-4"
                            />
                            पुरुष
                          </label>

                          <label className="flex items-center gap-2">
                            <Input
                              type="radio"
                              checked={values.directorGender === "O"}
                              onChange={() =>
                                setFieldValue("directorGender", "O")
                              }
                              className="h-4 w-4"
                            />
                            इतर
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="अर्जदार प्रकार"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Select
                          value={values.directorApplicantType}
                          onValueChange={(value) =>
                            setFieldValue("directorApplicantType", value)
                          }
                        >
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="-- Select Option --" />
                          </SelectTrigger>

                          <SelectContent>
                            {applicantTypeOptions.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:col-span-2 md:grid-cols-[280px_20px_minmax(0,1fr)]">
                        <Label
                          text="पत्ता"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <textarea
                          value={values.directorAddress}
                          onChange={(e) =>
                            setFieldValue("directorAddress", e.target.value)
                          }
                          className="min-h-[90px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center">
                        <Label
                          text="संचालकांचा फोटो"
                          required
                          className="!w-full text-[14px] font-medium"
                        />

                        <span className="hidden md:block">:</span>

                        <Input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) =>
                            setFieldValue(
                              "directorImage",
                              e.currentTarget.files?.[0] || null,
                            )
                          }
                          className="h-10 w-full"
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <Button
                        type="button"
                        onClick={() => addDirector(values, setFieldValue)}
                      >
                        Add Director
                      </Button>
                    </div>

                    <div className="mt-5 w-full overflow-x-auto">
                      <Table className="min-w-[1000px] border">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="bg-[#184aa6] text-white">
                              Aadhar No
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Name
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Mobile
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Email
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Gender
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Address
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Applicant Type
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Remove
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {directorRows.length > 0 ? (
                            directorRows.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.aadharNo}</TableCell>

                                <TableCell>{item.directorName}</TableCell>

                                <TableCell>{item.mobileNo}</TableCell>

                                <TableCell>{item.email}</TableCell>

                                <TableCell>{item.gender}</TableCell>

                                <TableCell>{item.address}</TableCell>

                                <TableCell>{item.applicantType}</TableCell>

                                <TableCell>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeDirector(item.id)}
                                  >
                                    Remove
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="py-5 text-center"
                              >
                                No records found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6 flex flex-col justify-center gap-3 border-t pt-5 sm:flex-row">
                      <Button
                        type="button"
                        onClick={() => setActiveTab("documents")}
                      >
                        पुढे जा
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("primary")}
                      >
                        मागे
                      </Button>
                    </div>
                  </TabsContent>


                  <TabsContent value="documents" className="px-4 py-5 sm:px-6">
                    <div className="w-full overflow-x-auto">
                      <Table className="min-w-[1000px] border">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="bg-[#184aa6] text-white">
                              अ.क्र.
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Document Name
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Type
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Status
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              File Name
                            </TableHead>

                            <TableHead className="bg-[#184aa6] text-white">
                              Upload
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {documentRows.length > 0 ? (
                            documentRows.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.srNo}</TableCell>

                                <TableCell className="whitespace-normal">
                                  {item.documentName}
                                </TableCell>

                                <TableCell>{item.documentType}</TableCell>

                                <TableCell>
                                  {item.active === "Y" ? "Active" : "Inactive"}
                                </TableCell>

                                <TableCell>{item.fileName}</TableCell>

                                <TableCell>
                                  <Input
                                    type="file"
                                    disabled={item.active !== "Y"}
                                    accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx,.xls"
                                    onChange={(e) =>
                                      handleDocumentFile(
                                        item.id,
                                        e.currentTarget.files?.[0],
                                      )
                                    }
                                    className="h-9"
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="py-8 text-center"
                              >
                                No Document Details Found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-6 flex flex-col justify-center gap-3 border-t pt-5 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("director")}
                      >
                        मागे
                      </Button>

                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetForm();

                          setTradeTypeRateRows([]);

                          setDirectorRows([]);

                          setActiveTab("primary");
                        }}
                      >
                        रिसेट करा
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FrmMarketEntry;
