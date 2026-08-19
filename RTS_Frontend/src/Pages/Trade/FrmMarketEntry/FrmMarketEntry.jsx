import React, { useMemo, useState } from "react";
import { Formik, Form } from "formik";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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

/* =========================================================
   INITIAL VALUES
========================================================= */

const initialValues = {
  applicationType: "new",

  shopNameEnglish: "",
  shopNameMarathi: "",
  panCardNo: "",
  contactNo: "",
  email: "",
  shopAddress: "",

  wardNo: "",
  zoneNo: "",

  financialFromYear: "",
  financialToYear: "",

  amount: "0",

  tradeCategory: "",
  tradeType: "",
  rate: "",

  isManufactured: "yes",
  ownerName: "",
  rentAgreementWithWhom: "",
  corporationNoc: "yes",
  businessStartYear: "",
  otherAdministrationRegistrationNo: "",

  isOwnerDoingBusiness: "yes",
  ownerAddress: "",
  usedArea: "",
  licenseType: "",
  shopActRegistrationNo: "",

  directorAadharNo: "",
  directorName: "",
  directorContactNo: "",
  directorEmail: "",
  directorGender: "F",
  directorAddress: "",
  directorApplicantType: "",
  directorImage: null,
};


const zoneOptions = [
  {
    value: "1",
    label: "Zone 1",
  },
  {
    value: "2",
    label: "Zone 2",
  },
  {
    value: "3",
    label: "Zone 3",
  },
];

const financialYearOptions = [
  {
    value: "2024-25",
    label: "2024-25",
  },
  {
    value: "2025-26",
    label: "2025-26",
  },
  {
    value: "2026-27",
    label: "2026-27",
  },
  {
    value: "2027-28",
    label: "2027-28",
  },
];

const tradeCategoryOptions = [
  {
    value: "1",
    label: "Food Business",
  },
  {
    value: "2",
    label: "Retail Business",
  },
  {
    value: "3",
    label: "Service Business",
  },
];

const tradeTypeOptions = [
  {
    value: "101",
    label: "Restaurant",
    rate: "1000",
    categoryId: "1",
  },
  {
    value: "102",
    label: "Bakery",
    rate: "1500",
    categoryId: "1",
  },
  {
    value: "201",
    label: "General Store",
    rate: "800",
    categoryId: "2",
  },
  {
    value: "202",
    label: "Clothing Store",
    rate: "1200",
    categoryId: "2",
  },
  {
    value: "301",
    label: "Repair Service",
    rate: "700",
    categoryId: "3",
  },
];

const licenseTypeOptions = [
  {
    value: "1",
    label: "License Type 1",
  },
  {
    value: "2",
    label: "License Type 2",
  },
];

const applicantTypeOptions = [
  {
    value: "1",
    label: "Individual",
  },
  {
    value: "2",
    label: "Partnership",
  },
  {
    value: "3",
    label: "Company",
  },
];

const initialDocumentRows = [
  {
    id: "1",
    documentName: "Test Document",
    fileName: "",
    file: null,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const FrmMarketEntry = () => {
  const [mode, setMode] = useState("new");

  const [tradeTypeRows, setTradeTypeRows] = useState([]);

  const [directorRows, setDirectorRows] = useState([]);

  const [documentRows, setDocumentRows] = useState(initialDocumentRows);

  /* =======================================================
     TOTAL AMOUNT
  ======================================================= */

  const totalAmount = useMemo(() => {
    return tradeTypeRows.reduce(
      (total, row) => total + Number(row.rate || 0),
      0,
    );
  }, [tradeTypeRows]);

  /* =======================================================
     ADD TRADE TYPE
  ======================================================= */

  const handleAddTradeType = (values, setFieldValue) => {
    if (!values.tradeCategory) {
      alert("Please Select Trade Category");
      return;
    }

    if (!values.tradeType) {
      alert("Please Select Trade Type");
      return;
    }

    const exists = tradeTypeRows.some(
      (row) => String(row.tradeTypeId) === String(values.tradeType),
    );

    if (exists) {
      alert("Trade Type already Added in List");
      return;
    }

    const selectedTradeType = tradeTypeOptions.find(
      (item) => String(item.value) === String(values.tradeType),
    );

    const selectedCategory = tradeCategoryOptions.find(
      (item) => String(item.value) === String(values.tradeCategory),
    );

    const newRow = {
      id: Date.now(),
      tradeTypeId: values.tradeType,
      tradeType: selectedTradeType?.label || "",
      rate: values.rate || selectedTradeType?.rate || "0",
      tradeCategoryId: values.tradeCategory,
      tradeCategory: selectedCategory?.label || "",
    };

    const updatedRows = [...tradeTypeRows, newRow];

    setTradeTypeRows(updatedRows);

    setFieldValue(
      "amount",
      String(updatedRows.reduce((sum, row) => sum + Number(row.rate || 0), 0)),
    );

    setFieldValue("tradeType", "");
    setFieldValue("rate", "");
  };

  /* =======================================================
     REMOVE TRADE TYPE
  ======================================================= */

  const handleRemoveTradeType = (id, setFieldValue) => {
    const updatedRows = tradeTypeRows.filter((row) => row.id !== id);

    setTradeTypeRows(updatedRows);

    setFieldValue(
      "amount",
      String(updatedRows.reduce((sum, row) => sum + Number(row.rate || 0), 0)),
    );
  };

  /* =======================================================
     ADD DIRECTOR
  ======================================================= */

  const handleAddDirector = (values, setFieldValue) => {
    if (!values.directorAadharNo.trim()) {
      alert("Please Enter Director Aadhar No");
      return;
    }

    if (!values.directorName.trim()) {
      alert("Please Enter Director Name");
      return;
    }

    if (!values.directorContactNo.trim()) {
      alert("Please Enter Director Mobile No");
      return;
    }

    if (!values.directorEmail.trim()) {
      alert("Please Enter Director Email");
      return;
    }

    if (!values.directorAddress.trim()) {
      alert("Please Enter Director Address");
      return;
    }

    if (!values.directorApplicantType) {
      alert("Please Select Applicant Type");
      return;
    }

    if (!values.directorImage) {
      alert("Please Upload Director Image");
      return;
    }

    const extension = values.directorImage.name.split(".").pop()?.toLowerCase();

    if (!["jpg", "jpeg", "png"].includes(extension)) {
      alert("Only .jpg, .jpeg and .png files are allowed");
      return;
    }

    if (values.directorImage.size > 500000) {
      alert("Director Image Size Cannot Be Greater Than 500KB");
      return;
    }

    const applicant = applicantTypeOptions.find(
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
        applicantType: applicant?.label || "",
        image: values.directorImage,
      },
    ]);

    setFieldValue("directorAadharNo", "");
    setFieldValue("directorName", "");
    setFieldValue("directorContactNo", "");
    setFieldValue("directorEmail", "");
    setFieldValue("directorGender", "F");
    setFieldValue("directorAddress", "");
    setFieldValue("directorApplicantType", "");
    setFieldValue("directorImage", null);
  };

  /* =======================================================
     REMOVE DIRECTOR
  ======================================================= */

  const handleRemoveDirector = (id) => {
    setDirectorRows((previous) => previous.filter((row) => row.id !== id));
  };

  /* =======================================================
     DOCUMENT
  ======================================================= */

  const handleDocumentChange = (id, file) => {
    if (!file) {
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (
      !["jpg", "jpeg", "png", "xlsx", "xls", "docx", "pdf"].includes(extension)
    ) {
      alert(
        "Only .jpg, .jpeg, .png, .xlsx, .xls, .docx and .pdf files are allowed",
      );
      return;
    }

    if (file.size > 5242880) {
      alert("Document Size Should Be Less Than 5 MB");
      return;
    }

    setDocumentRows((previous) =>
      previous.map((row) =>
        String(row.id) === String(id)
          ? {
              ...row,
              file,
              fileName: file.name,
            }
          : row,
      ),
    );
  };

  /* =======================================================
     DOWNLOAD DOCUMENT
  ======================================================= */

  const handleDownloadDocument = (document) => {
    if (!document.file) {
      return;
    }

    const url = URL.createObjectURL(document.file);

    const anchor = window.document.createElement("a");

    anchor.href = url;
    anchor.download = document.file.name;

    anchor.click();

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (values) => {
    console.log("Market Entry UI Data", {
      mode,
      values,
      totalAmount,
      tradeTypeRows,
      directorRows,
      documentRows,
    });

    alert(
      mode === "renewal"
        ? "Renewal UI submitted."
        : "New application UI submitted.",
    );
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="w-full">
          <Card className="w-full rounded-xl border border-gray-300 bg-white shadow-sm">
            <CardContent className="p-0">
              {/* =================================================
                  TABS
              ================================================= */}

              <Tabs defaultValue="primary" className="w-full">
                <div className="px-4 pt-4 sm:px-6">
                  <TabsList
                    variant="line"
                    className="
                      h-auto
                      w-full
                      justify-start
                      overflow-x-auto
                      rounded-none
                      border-b
                      border-gray-200
                      bg-transparent
                      p-0
                    "
                  >
                    <TabsTrigger
                      value="primary"
                      className="
                        min-w-fit
                        rounded-none
                        px-5
                        py-3
                        text-[16px]
                        font-semibold
                      "
                    >
                      प्राथमिक माहिती
                    </TabsTrigger>

                    <TabsTrigger
                      value="director"
                      className="
                        min-w-fit
                        rounded-none
                        px-5
                        py-3
                        text-[16px]
                        font-semibold
                      "
                    >
                      संचालक माहिती
                    </TabsTrigger>

                    <TabsTrigger
                      value="documents"
                      className="
                        min-w-fit
                        rounded-none
                        px-5
                        py-3
                        text-[16px]
                        font-semibold
                      "
                    >
                      कागदपत्र जोडणे
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* =================================================
                    PRIMARY TAB
                ================================================= */}

                <TabsContent value="primary" className="mt-0 px-4 py-5 sm:px-6">
                  {/* NEW / RENEWAL */}

                  <div className="mb-6 flex justify-center">
                    <div className="flex items-center gap-6">
                      <label className="flex cursor-pointer items-center gap-2">
                        <Input
                          type="radio"
                          name="applicationType"
                          value="new"
                          checked={values.applicationType === "new"}
                          onChange={() => {
                            setFieldValue("applicationType", "new");
                            setMode("new");
                          }}
                          className="h-4 w-4"
                        />

                        <span className="text-[15px]">New</span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-2">
                        <Input
                          type="radio"
                          name="applicationType"
                          value="renewal"
                          checked={values.applicationType === "renewal"}
                          onChange={() => {
                            setFieldValue("applicationType", "renewal");
                            setMode("renewal");
                          }}
                          className="h-4 w-4"
                        />

                        <span className="text-[15px]">Renewal</span>
                      </label>
                    </div>
                  </div>

                  {/* SHOP INFORMATION */}

                  <div className="grid w-full grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-2">
                    {/* Shop Name English */}

                    <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="दुकानाचे नाव इंग्रजी"
                        required
                        className="!w-full whitespace-nowrap text-[16px] font-medium leading-5"
                      />

                      <span className="hidden text-center text-[16px] md:block">
                        :
                      </span>

                      <Input
                        id="shopNameEnglish"
                        name="shopNameEnglish"
                        value={values.shopNameEnglish}
                        onChange={(e) =>
                          setFieldValue("shopNameEnglish", e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Shop Name Marathi */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="दुकानाचे नाव मराठी"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="shopNameMarathi"
                        name="shopNameMarathi"
                        value={values.shopNameMarathi}
                        onChange={(e) =>
                          setFieldValue("shopNameMarathi", e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* PAN */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="पॅन कार्ड नं."
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="panCardNo"
                        name="panCardNo"
                        value={values.panCardNo}
                        onChange={(e) =>
                          setFieldValue("panCardNo", e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Contact */}

                    <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="संपर्क क्र."
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="contactNo"
                        name="contactNo"
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
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

                    {/* Email */}

                      <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="ई-मेल"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={(e) => setFieldValue("email", e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Address */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="दुकानाचा पत्ता"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="shopAddress"
                        name="shopAddress"
                        value={values.shopAddress}
                        onChange={(e) =>
                          setFieldValue("shopAddress", e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Ward */}

                      <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="वार्ड क्र."
                        required
                        className="!w-full text-[16px] font-medium"
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
                         
                            <SelectItem>
                             
                            </SelectItem>
                        
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Zone */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="झोन क्र."
                        required
                        className="!w-full text-[16px] font-medium"
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

                    {/* Financial From Year */}

                    <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="Financial FromYear"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Select
                        value={values.financialFromYear}
                        onValueChange={(value) =>
                          setFieldValue("financialFromYear", value)
                        }
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>

                        <SelectContent>
                          {financialYearOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Financial To Year */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="Financial ToYear"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Select
                        value={values.financialToYear}
                        onValueChange={(value) =>
                          setFieldValue("financialToYear", value)
                        }
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>

                        <SelectContent>
                          {financialYearOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Amount */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="रक्कम"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="amount"
                        name="amount"
                        value={String(totalAmount)}
                        readOnly
                        className="h-10 w-full bg-gray-100"
                      />
                    </div>

                    {/* Trade Category */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="Trade Category"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Select
                        value={values.tradeCategory}
                        onValueChange={(value) => {
                          setFieldValue("tradeCategory", value);

                          setFieldValue("tradeType", "");

                          setFieldValue("rate", "");
                        }}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="-- Select Option --" />
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

                    {/* Trade Type */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="Trade Type"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Select
                        value={values.tradeType}
                        onValueChange={(value) => {
                          setFieldValue("tradeType", value);

                          const selected = tradeTypeOptions.find(
                            (item) => String(item.value) === String(value),
                          );

                          setFieldValue("rate", selected?.rate || "");
                        }}
                      >
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="-- Select Option --" />
                        </SelectTrigger>

                        <SelectContent>
                          {tradeTypeOptions
                            .filter(
                              (item) =>
                                String(item.categoryId) ===
                                String(values.tradeCategory),
                            )
                            .map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rate */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="Rate"
                        required
                        className="w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="rate"
                        name="rate"
                        type="number"
                        value={values.rate}
                        onChange={(e) => setFieldValue("rate", e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>

                  {/* ADD TO LIST */}

                  <div className="mt-5">
                    <Button
                      type="button"
                      onClick={() => handleAddTradeType(values, setFieldValue)}
                    >
                      Add TO List
                    </Button>
                  </div>

                  {/* TRADE TYPE LIST */}

                  {tradeTypeRows.length > 0 && (
                    <div className="mt-5 w-full overflow-x-auto">
                      <Table className="min-w-[750px] border border-gray-300">
                        <TableHeader>
                          <TableRow>
                            <TableHead className=" text-white">
                              Trade Type
                            </TableHead>

                            <TableHead className=" text-white">
                              Rate
                            </TableHead>

                            <TableHead className=" text-white">
                              Trade Category
                            </TableHead>

                            <TableHead className=" text-white">
                              Remove
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {tradeTypeRows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{row.tradeType}</TableCell>

                              <TableCell>{row.rate}</TableCell>

                              <TableCell>{row.tradeCategory}</TableCell>

                              <TableCell>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveTradeType(row.id, setFieldValue)
                                  }
                                >
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* =================================================
                      BUSINESS SECTION
                  ================================================= */}

                  <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 xl:grid-cols-2">
                    {/* LEFT BUSINESS NATURE */}

                    <div className="w-full">
                      <h2 className="mb-6 text-center text-2xl font-bold text-black">
                        व्यवसायाचे स्वरूप
                      </h2>

                      <div className="space-y-5">
                        {/* Production */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="वस्तू निर्मित आहे का"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <Input
                                type="radio"
                                name="isManufactured"
                                checked={values.isManufactured === "yes"}
                                onChange={() =>
                                  setFieldValue("isManufactured", "yes")
                                }
                                className="h-4 w-4"
                              />

                              <span>होय</span>
                            </label>

                            <label className="flex items-center gap-2">
                              <Input
                                type="radio"
                                name="isManufactured"
                                checked={values.isManufactured === "no"}
                                onChange={() =>
                                  setFieldValue("isManufactured", "no")
                                }
                                className="h-4 w-4"
                              />

                              <span>नाही</span>
                            </label>
                          </div>
                        </div>

                        {/* Owner Name */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="जागा मालकीचे नाव"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="ownerName"
                            value={values.ownerName}
                            onChange={(e) =>
                              setFieldValue("ownerName", e.target.value)
                            }
                            className="h-10 w-full"
                          />
                        </div>

                        {/* Agreement */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="भाडे करार कोणासोबत केले आहे"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="rentAgreementWithWhom"
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

                        {/* NOC */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="व्यवसायासाठी म. न. पा. चे नाहरकत प्रमाणपत्र घेतले आहे का"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <Input
                                type="radio"
                                name="corporationNoc"
                                checked={values.corporationNoc === "yes"}
                                onChange={() =>
                                  setFieldValue("corporationNoc", "yes")
                                }
                                className="h-4 w-4"
                              />

                              <span>होय</span>
                            </label>

                            <label className="flex items-center gap-2">
                              <Input
                                type="radio"
                                name="corporationNoc"
                                checked={values.corporationNoc === "no"}
                                onChange={() =>
                                  setFieldValue("corporationNoc", "no")
                                }
                                className="h-4 w-4"
                              />

                              <span>नाही</span>
                            </label>
                          </div>
                        </div>

                        {/* Business Start Year */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="व्यवसाय सुरू केल्याचे वर्ष"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="businessStartYear"
                            value={values.businessStartYear}
                            onChange={(e) =>
                              setFieldValue("businessStartYear", e.target.value)
                            }
                            className="h-10 w-full"
                          />
                        </div>

                        {/* Other Registration */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="अन्न व औषध प्रशासन कायद्यान्वये नोंदणी क्र."
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="otherAdministrationRegistrationNo"
                            value={values.otherAdministrationRegistrationNo}
                            onChange={(e) =>
                              setFieldValue(
                                "otherAdministrationRegistrationNo",
                                e.target.value,
                              )
                            }
                            className="h-10 w-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RIGHT BUSINESS */}

                    <div className="w-full">
                      <h2 className="mb-6 text-center text-2xl font-bold text-black">
                        व्यवसाय
                      </h2>

                      {/* Own Space */}

                      <div className="mb-5 w-full overflow-x-auto">
                        <Table className="min-w-[500px] border border-gray-300">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-20 bg-[rgb(24,74,166)] text-center text-white">
                                <div className="flex justify-center">
                                  <Input type="checkbox" />
                                </div>
                              </TableHead>

                              <TableHead className="bg-[rgb(24,74,166)] text-center font-bold text-white">
                                Trade
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            <TableRow>
                              <TableCell className="text-center">
                                <div className="flex justify-center">
                                  <Input type="checkbox" />
                                </div>
                              </TableCell>

                              <TableCell>Trade</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <div className="space-y-5">
                        {/* Own Space */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="स्वतःचे मालकीचे जागेत व्यवसाय करीत आहे का"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <Input
                                type="radio"
                                name="isOwnerDoingBusiness"
                                checked={values.isOwnerDoingBusiness === "yes"}
                                onChange={() =>
                                  setFieldValue("isOwnerDoingBusiness", "yes")
                                }
                                className="h-4 w-4"
                              />

                              <span>होय</span>
                            </label>

                            <label className="flex items-center gap-2">
                              <Input
                                type="radio"
                                name="isOwnerDoingBusiness"
                                checked={values.isOwnerDoingBusiness === "no"}
                                onChange={() =>
                                  setFieldValue("isOwnerDoingBusiness", "no")
                                }
                                className="h-4 w-4"
                              />

                              <span>नाही</span>
                            </label>
                          </div>
                        </div>

                        {/* Owner Address */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="जागा मालकाचा पत्ता"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="ownerAddress"
                            value={values.ownerAddress}
                            onChange={(e) =>
                              setFieldValue("ownerAddress", e.target.value)
                            }
                            className="h-10 w-full"
                          />
                        </div>

                        {/* Area */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="वापरात आलेले जागेचे क्षेत्र चौ. फु. मध्ये"
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="usedArea"
                            type="number"
                            value={values.usedArea}
                            onChange={(e) =>
                              setFieldValue("usedArea", e.target.value)
                            }
                            className="h-10 w-full"
                          />
                        </div>

                        {/* License */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="License Type"
                            required
                            className="w-full text-[16px] font-medium"
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

                        {/* Shop Act */}

                         <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                          <Label
                            text="शॉप अक्ट नोंदणी क्र."
                            required
                            className="!w-full text-[16px] font-medium"
                          />

                          <span className="hidden md:block">:</span>

                          <Input
                            id="shopActRegistrationNo"
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
                    </div>
                  </div>

                  {/* SUBMIT */}

                  <div className="mt-7 border-t border-gray-200 pt-5">
                    <div className="flex justify-center">
                      <Button type="submit">Submit</Button>
                    </div>
                  </div>
                </TabsContent>

                {/* =================================================
                    DIRECTOR TAB
                ================================================= */}

                <TabsContent
                  value="director"
                  className="mt-0 px-4 py-5 sm:px-6"
                >
                  <div className="grid w-full grid-cols-1 gap-x-8 gap-y-5 xl:grid-cols-2">
                    {/* Aadhar */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="संचालकांचा आधार क्रमांक"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="directorAadharNo"
                        value={values.directorAadharNo}
                        maxLength={12}
                        inputMode="numeric"
                        onChange={(e) =>
                          setFieldValue(
                            "directorAadharNo",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Name */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="संचालकांचे नाव"
                        required
                        className="w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="directorName"
                        value={values.directorName}
                        onChange={(e) =>
                          setFieldValue("directorName", e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Contact */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="संपर्क क्र."
                        required
                        className="w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="directorContactNo"
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
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

                    {/* Email */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="ई-मेल"
                        required
                        className="w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="directorEmail"
                        type="email"
                        value={values.directorEmail}
                        onChange={(e) =>
                          setFieldValue("directorEmail", e.target.value)
                        }
                        className="h-10 w-full"
                      />
                    </div>

                    {/* Gender */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="लिंग"
                        required
                        className="w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-2">
                          <Input
                            type="radio"
                            name="directorGender"
                            checked={values.directorGender === "F"}
                            onChange={() =>
                              setFieldValue("directorGender", "F")
                            }
                            className="h-4 w-4"
                          />

                          <span>स्त्री</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <Input
                            type="radio"
                            name="directorGender"
                            checked={values.directorGender === "M"}
                            onChange={() =>
                              setFieldValue("directorGender", "M")
                            }
                            className="h-4 w-4"
                          />

                          <span>पुरुष</span>
                        </label>

                        <label className="flex items-center gap-2">
                          <Input
                            type="radio"
                            name="directorGender"
                            checked={values.directorGender === "O"}
                            onChange={() =>
                              setFieldValue("directorGender", "O")
                            }
                            className="h-4 w-4"
                          />

                          <span>इतर</span>
                        </label>
                      </div>
                    </div>

                    {/* Applicant Type */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="अर्जदार प्रकार"
                        required
                        className="w-full text-[16px] font-medium"
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

                    {/* Address */}

                    <div className="grid grid-cols-1 gap-2 md:col-span-2 md:grid-cols-[250px_18px_minmax(0,1fr)] md:items-start">
                      <Label
                        text="पत्ता"
                        required
                        className="w-full text-[16px] font-medium"
                      />

                      <span className="hidden pt-2 md:block">:</span>

                      <textarea
                        id="directorAddress"
                        value={values.directorAddress}
                        onChange={(e) =>
                          setFieldValue("directorAddress", e.target.value)
                        }
                        className="
                          min-h-[90px]
                          w-full
                          resize-y
                          rounded-md
                          border
                          border-gray-300
                          bg-white
                          px-3
                          py-2
                          text-sm
                          outline-none
                          focus:border-primary
                          focus:ring-1
                          focus:ring-primary
                        "
                      />
                    </div>

                    {/* Image */}

                     <div className="grid w-full grid-cols-1 md:grid-cols-[280px_20px_minmax(0,1fr)] md:items-center md:gap-x-2">
                      <Label
                        text="संचालकांचा फोटो"
                        required
                        className="!w-full text-[16px] font-medium"
                      />

                      <span className="hidden md:block">:</span>

                      <Input
                        id="directorImage"
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

                  {/* ADD DIRECTOR */}

                  <div className="mt-5">
                    <Button
                      type="button"
                      onClick={() => handleAddDirector(values, setFieldValue)}
                    >
                      Add Director
                    </Button>
                  </div>

                  {/* DIRECTOR TABLE */}

                  <div className="mt-5 w-full overflow-x-auto">
                    <Table className="min-w-[1100px] border border-gray-300">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Aadhar No
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Director Name
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Mobile No
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Email
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Gender
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Address
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Applicant Type
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Director Image
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Remove
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {directorRows.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>{row.aadharNo}</TableCell>

                            <TableCell>{row.directorName}</TableCell>

                            <TableCell>{row.mobileNo}</TableCell>

                            <TableCell>{row.email}</TableCell>

                            <TableCell>{row.gender}</TableCell>

                            <TableCell>{row.address}</TableCell>

                            <TableCell>{row.applicantType}</TableCell>

                            <TableCell>{row.image?.name || "-"}</TableCell>

                            <TableCell>
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveDirector(row.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        {directorRows.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="h-10 text-center text-gray-500"
                            >
                              No records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* SUBMIT */}

                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <div className="flex justify-center">
                      <Button type="submit">Submit</Button>
                    </div>
                  </div>
                </TabsContent>

                {/* =================================================
                    DOCUMENT TAB
                ================================================= */}

                <TabsContent
                  value="documents"
                  className="mt-0 px-4 py-5 sm:px-6"
                >
                  <div className="mb-4 text-center text-[16px] text-black">
                    Document Format : png, jpg, jpeg, docx, pdf
                  </div>

                  <div className="w-full overflow-x-auto">
                    <Table className="min-w-[900px] border border-gray-300">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Document Name
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            File Name
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Choose File
                          </TableHead>

                          <TableHead className="bg-[rgb(24,74,166)] text-center text-white">
                            Download
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {documentRows.map((document) => (
                          <TableRow key={document.id}>
                            <TableCell>{document.documentName}</TableCell>

                            <TableCell>
                              <Input
                                value={document.fileName}
                                readOnly
                                className="h-8"
                              />
                            </TableCell>

                            <TableCell>
                              <Input
                                type="file"
                                accept=".jpg,.jpeg,.png,.docx,.pdf,.xlsx,.xls"
                                className="h-9"
                                onChange={(e) =>
                                  handleDocumentChange(
                                    document.id,
                                    e.currentTarget.files?.[0] || null,
                                  )
                                }
                              />
                            </TableCell>

                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="link"
                                disabled={!document.file}
                                onClick={() => handleDownloadDocument(document)}
                              >
                                Download
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* SUBMIT */}

                  <div className="mt-6 border-t border-gray-200 pt-5">
                    <div className="flex justify-center">
                      <Button type="submit">Submit</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Form>
      )}
    </Formik>
  );
};

export default FrmMarketEntry;
