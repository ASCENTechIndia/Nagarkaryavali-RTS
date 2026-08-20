import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const FrmWaterConnectionApplication = () => {
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

  const [documentFile, setDocumentFile] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <Card className="shadow-sm border">
        {/* Header */}
        <CardHeader className="border-b px-4 py-2">
          <CardTitle className="text-lg font-semibold">
            Water Connection Application
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">

          {/* =====================================================
              APPLICATION DETAILS
          ===================================================== */}
          <div>
            <h4 className="text-md font-semibold mb-3">
              Application Details
            </h4>

            <hr className="mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

              {/* Zone */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Zone" required />
                  <span>:</span>
                </div>

                <Select
                  value={formData.zone}
                  onValueChange={(value) =>
                    handleChange("zone", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Select Option --" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="DIVA">DIVA</SelectItem>
                    <SelectItem value="ZONE1">ZONE 1</SelectItem>
                    <SelectItem value="ZONE2">ZONE 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div />

              {/* First Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="First Name" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    handleChange("firstName", e.target.value)
                  }
                  placeholder="First Name"
                />
              </div>

              {/* Middle Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Middle Name" />
                  <span>:</span>
                </div>

                <Input
                  value={formData.middleName}
                  onChange={(e) =>
                    handleChange("middleName", e.target.value)
                  }
                  placeholder="Middle Name"
                />
              </div>

              {/* Last Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Last Name" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    handleChange("lastName", e.target.value)
                  }
                  placeholder="Last Name"
                />
              </div>

              {/* =====================================================
                  MARATHI NAME
              ===================================================== */}

              <div />

              {/* Marathi First Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="प्रथम नाव" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.firstNameMarathi}
                  onChange={(e) =>
                    handleChange(
                      "firstNameMarathi",
                      e.target.value
                    )
                  }
                  placeholder="प्रथम नाव"
                />
              </div>

              {/* Marathi Middle Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="मधले नाव" />
                  <span>:</span>
                </div>

                <Input
                  value={formData.middleNameMarathi}
                  onChange={(e) =>
                    handleChange(
                      "middleNameMarathi",
                      e.target.value
                    )
                  }
                  placeholder="मधले नाव"
                />
              </div>

              {/* Marathi Last Name */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="आडनाव" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.lastNameMarathi}
                  onChange={(e) =>
                    handleChange(
                      "lastNameMarathi",
                      e.target.value
                    )
                  }
                  placeholder="आडनाव"
                />
              </div>

              {/* Mobile No */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Mobile No." required />
                  <span>:</span>
                </div>

                <Input
                  type="text"
                  maxLength={10}
                  value={formData.mobileNo}
                  onChange={(e) =>
                    handleChange("mobileNo", e.target.value)
                  }
                  placeholder="Mobile No."
                />
              </div>

              {/* Aadhaar */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Aadhar Card No" required />
                  <span>:</span>
                </div>

                <Input
                  type="text"
                  maxLength={12}
                  value={formData.aadharNo}
                  onChange={(e) =>
                    handleChange("aadharNo", e.target.value)
                  }
                  placeholder="Aadhar Card No"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Email" required />
                  <span>:</span>
                </div>

                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                  placeholder="Email"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Address" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.address}
                  onChange={(e) =>
                    handleChange("address", e.target.value)
                  }
                  placeholder="Address"
                />
              </div>

              {/* Marathi Address */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="पत्ता (मराठी)" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.addressMarathi}
                  onChange={(e) =>
                    handleChange(
                      "addressMarathi",
                      e.target.value
                    )
                  }
                  placeholder="पत्ता"
                />
              </div>

              {/* Purpose */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Purpose" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.purpose}
                  onChange={(e) =>
                    handleChange("purpose", e.target.value)
                  }
                  placeholder="Purpose"
                />
              </div>

              {/* Marathi Purpose */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="उद्देश (मराठी)" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.purposeMarathi}
                  onChange={(e) =>
                    handleChange(
                      "purposeMarathi",
                      e.target.value
                    )
                  }
                  placeholder="उद्देश"
                />
              </div>

              {/* Connection No */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Connection No" required />
                  <span>:</span>
                </div>

                <Input
                  value={formData.connectionNo}
                  onChange={(e) =>
                    handleChange(
                      "connectionNo",
                      e.target.value
                    )
                  }
                  placeholder="Connection No"
                />
              </div>

              {/* Consume Type */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Consume Type" required />
                  <span>:</span>
                </div>

                <Select
                  value={formData.consumeType}
                  onValueChange={(value) =>
                    handleChange("consumeType", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Select Option --" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Domestic">
                      Domestic
                    </SelectItem>

                    <SelectItem value="Commercial">
                      Commercial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Meter Type */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="sm:w-40 shrink-0 flex justify-start sm:justify-between items-center">
                  <Label text="Meter Type" required />
                  <span>:</span>
                </div>

                <Select
                  value={formData.meterType}
                  onValueChange={(value) =>
                    handleChange("meterType", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Select Option --" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Metered">
                      Metered
                    </SelectItem>

                    <SelectItem value="Non-Metered">
                      Non-Metered
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* =====================================================
              DOCUMENT DETAILS
          ===================================================== */}

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
                  <tr>
                    <td className="border px-3 py-2">
                      1
                    </td>

                    <td className="border px-3 py-2">
                      मूळ मंजूर कर्ज ऑर्डर / गट वर्षांचे पाणी बिल
                    </td>

                    <td className="border px-3 py-2">
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) =>
                          setDocumentFile(
                            e.target.files?.[0] || null
                          )
                        }
                        className="cursor-pointer"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <div className="flex items-center justify-center gap-3 border-t pt-5">
            <Button
              type="button"
              className="px-8 bg-teal-600 hover:bg-teal-700"
            >
              Submit
            </Button>

            <Button
              type="button"
              variant="outline"
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