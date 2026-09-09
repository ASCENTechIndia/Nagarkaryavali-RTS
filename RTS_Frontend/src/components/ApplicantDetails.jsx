import React from "react";
import { useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BUSINESS_TYPES = [
  {
    id: "tour-operator",
    name: "Tour Operator",
  },
  {
    id: "travel-agency",
    name: "Travel Agency",
  },
  {
    id: "ticketing-agency",
    name: "Ticketing Agency",
  },
  {
    id: "other",
    name: "इतर",
  },
];

const ApplicantDetails = () => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleBlur,
  } = useFormikContext();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold">
          अर्जदाराचा तपशील
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label required text="अर्जदाराचे नाव" />
              <span>:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
              <Input
                name="firstName"
                value={values.firstName || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="पहिले नाव"
                className={`w-full h-9`}
              />

              <Input
                name="middleName"
                value={values.middleName || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="मधले नाव"
                className="w-full h-9"
              />

              <Input
                name="lastName"
                value={values.lastName || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="आडनाव"
                className="w-full h-9"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label required text="मोबाइल क्रमांक" />
              <span>:</span>
            </div>

            <div className="flex gap-2 w-full">
              <Select
                value={values.countryCode || "+91"}
                onValueChange={(value) =>
                  setFieldValue("countryCode", value)
                }
                disabled
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="+91">+91</SelectItem>
                </SelectContent>
              </Select>

              <Input
                name="mobileNo"
                value={values.mobileNo || ""}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setFieldValue("mobileNo", value);
                }}
                onBlur={handleBlur}
                placeholder="मोबाइल क्रमांक"
                maxLength={10}
                className={`w-full h-9`}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label required text="ई-मेल आयडी" />
              <span>:</span>
            </div>

            <Input
              type="email"
              name="emailId"
              value={values.emailId || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="ई-मेल आयडी"
              className={`w-full h-9`}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label required text="आधार क्रमांक" />
              <span>:</span>
            </div>

            <Input
              name="aadharNo"
              value={values.aadharNo || ""}
              onChange={(e) => {
                const value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 12);

                setFieldValue("aadharNo", value);
              }}
              onBlur={handleBlur}
              placeholder="Enter number only"
              maxLength={12}
              className={`w-full h-9`}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label required text="अर्जदाराचा निवासी पत्ता" />
              <span>:</span>
            </div>

            <Input
              name="residentialAddress"
              value={values.residentialAddress || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="अर्जदाराचा निवासी पत्ता"
              className={`w-full h-9`}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label text="पॅन कार्ड" />
              <span>:</span>
            </div>

            <Input
              name="panCard"
              value={values.panCard || ""}
              onChange={(e) => {
                setFieldValue(
                  "panCard",
                  e.target.value
                    .toUpperCase()
                    .slice(0, 10)
                );
              }}
              onBlur={handleBlur}
              placeholder="Enter PAN Card Number"
              maxLength={10}
              className="w-full h-9"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label text="संस्थेचे नाव (लागू असल्यास)" />
              <span>:</span>
            </div>

            <Input
              name="organizationName"
              value={values.organizationName || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="संस्थेचे नाव"
              className="w-full h-9"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label text="संस्थेचा पत्ता (लागू असल्यास)" />
              <span>:</span>
            </div>

            <Input
              name="organizationAddress"
              value={values.organizationAddress || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="संस्थेचा पत्ता"
              className="w-full h-9"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-center">
              <Label required text="व्यवसायचा प्रकार" />
              <span>:</span>
            </div>

            <Select
              value={values.businessType || ""}
              onValueChange={(value) =>
                setFieldValue("businessType", value)
              }
            >
              <SelectTrigger
                className={`w-full h-9`}
              >
                <SelectValue placeholder="कृपया निवडा" />
              </SelectTrigger>

              <SelectContent>
                {BUSINESS_TYPES.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <div className="sm:w-32 shrink-0 flex justify-between items-start">
              <Label required text="व्यवसायचे वर्णन" />
              <span>:</span>
            </div>

            <Input
              name="businessDescription"
              value={values.businessDescription || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicantDetails;