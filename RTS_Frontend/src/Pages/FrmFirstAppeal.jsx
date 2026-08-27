// import React, { useEffect, useState } from "react";
// import { Formik, Form } from "formik";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { Textarea } from "@/components/ui/textarea";
// import ShadCNTable from "@/components/ui/table";
// import Swal from "sweetalert2";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import config from "@/utils/config";

// const initialValues = {
//   firstAppellateAuthorityDesignation: "",
//   firstAppellateAuthorityOfficeAddress: "",
//   nameOfEligiblePerson: "",
//   addressOfEligiblePerson: "",
//   nameOfDesignatedOfficer: "",
//   addressOfDesignatedOfficer: "",
//   appealType: "",
//   applicationNo: "",
// };

// const FrmFirstAppeal = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, token } = useAuth();
//   const BASE_URL = import.meta.env.VITE_BASE_URL;
//   const locationState = location.state || {};
//   const ulbId = locationState.ulbId || user?.ulbId || "3";
//   const userId = locationState.userId || user?.userId || "151";
//   const zoneId = locationState.zoneId || user?.zoneId || "12";
//   const mahaUlbId = locationState.mahaUlbId || user?.mahaUlbId || ulbId;
//   const serviceId = locationState.serviceId || user?.serviceId || "290";

//   const [objections, setObjections] = useState([]);

//   const fetchObjections = async () => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/FrmPropertyAppel/objections`,
//         {
//           headers: {
//             Authorization: `Bearer ${token || localStorage.getItem("token")}`,
//           },
//         },
//       );

//       console.log("Objections Response:", response.data);

//       if (response.data?.ok && response.data?.data?.objections) {
//         setObjections(response.data.data.objections);
//       } else {
//         setObjections([]);
//       }
//     } catch (error) {
//       console.error("Error fetching objections:", error);

//       setObjections([]);

//       Swal.fire({
//         text:
//           error?.response?.data?.message || "Error fetching objection list.",
//         confirmButtonColor: "#1e3a8a",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchObjections();
//   }, [serviceId, ulbId]);

//   const handleSubmit = async (values) => {
//     console.log("submitted");
//   };

//   return (
//     <Formik initialValues={initialValues} onSubmit={handleSubmit}>
//       {({ values, handleChange, setFieldValue, resetForm }) => (
//         <Form>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-6"
//           >
//             <Card className="w-full border shadow-sm">
//               <CardHeader className="border-b px-3 sm:px-5 md:px-6 py-3 sm:py-4">
//                 <CardTitle className="text-base sm:text-lg md:text-xl">
//                   First Appeal
//                 </CardTitle>
//               </CardHeader>

//               <CardContent className="p-3 sm:p-5 md:p-6 lg:p-7">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-4">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="First Appellate Authority Designation"
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="firstAppellateAuthorityDesignation"
//                         value={values.firstAppellateAuthorityDesignation}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="First Appellate Authority Office Address"
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="firstAppellateAuthorityOfficeAddress"
//                         value={values.firstAppellateAuthorityOfficeAddress}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-4">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="Name of Eligible Person"
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="nameOfEligiblePerson"
//                         value={values.nameOfEligiblePerson}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="Address of Eligible Person"
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="addressOfEligiblePerson"
//                         value={values.addressOfEligiblePerson}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-4">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="Name of the Designated Officer"
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="nameOfDesignatedOfficer"
//                         value={values.nameOfDesignatedOfficer}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="Address of the Designated Officer"
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="addressOfDesignatedOfficer"
//                         value={values.addressOfDesignatedOfficer}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-4">
//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="Appeal Type"
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>

//                       <Select
//                         value={values.appealType}
//                         onValueChange={(value) =>
//                           setFieldValue("appealType", value)
//                         }
//                       >
//                         <SelectTrigger className="w-full h-9 sm:h-10 overflow-hidden">
//                           <SelectValue placeholder="-- Select Option --" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {/* {wards.map((ward) => (
//                             <SelectItem
//                               key={ward.wardId}
//                               value={String(ward.wardId)}
//                             >
//                               {ward.wardName}
//                             </SelectItem>
//                           ))} */}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
//                       <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
//                         <Label
//                           className="text-sm sm:text-base text-nowrap"
//                           text="Reference No./Application No."
//                           required
//                         />
//                         <span className="hidden md:block">:</span>
//                       </div>
//                       <Input
//                         name="applicationNo"
//                         value={values.applicationNo}
//                         onChange={handleChange}
//                         className="w-full h-9 sm:h-10"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex justify-center items-center pt-3">
//                     <Button
//                       type="submit"
//                       className="bg-blue-600 hover:bg-blue-700 text-white px-5"
//                       onClick={() => navigate("/app/FrmFirstAppealDocUpload")}
//                     >
//                       Next
//                     </Button>
//                   </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default FrmFirstAppeal;

import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const initialValues = {
  firstAppellateAuthorityDesignation: "",
  firstAppellateAuthorityOfficeAddress: "",
  nameOfEligiblePerson: "",
  addressOfEligiblePerson: "",
  nameOfDesignatedOfficer: "",
  addressOfDesignatedOfficer: "",
  appealType: "",
  applicationNo: "",
};

const FrmFirstAppeal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const locationState = location.state || {};

  const ulbId = locationState.ulbId || user?.ulbId;
  const userId = locationState.userId || user?.userId ;


  const [appealTypes, setAppealTypes] = useState([]);


  const fetchAppealTypes = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmFirstAppealDocUpload/appeal-types`,
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        },
      );

      console.log("Appeal Types Response:", response.data);

      if (response.data?.ok && response.data?.data?.rows) {
        setAppealTypes(response.data.data.rows);
      } else {
        setAppealTypes([]);
      }
    } catch (error) {
      console.error("Error fetching appeal types:", error);

      setAppealTypes([]);

      Swal.fire({
        text:
          error?.response?.data?.message || "Error fetching appeal type list.",
        confirmButtonColor: "#1e3a8a",
      });
    }
  };


  useEffect(() => {
    fetchAppealTypes();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log("First Appeal Form Data:", values);

      if (!values.firstAppellateAuthorityDesignation?.trim()) {
        Swal.fire({
          text: "Please Enter First Appellate Authority Designation",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.firstAppellateAuthorityOfficeAddress?.trim()) {
        Swal.fire({
          text: "Please Enter First Appellate Authority office address",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.nameOfEligiblePerson?.trim()) {
        Swal.fire({
          text: "Please Enter Name of the eligible person",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.addressOfEligiblePerson?.trim()) {
        Swal.fire({
          text: "Please Enter Address of the eligible person",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.nameOfDesignatedOfficer?.trim()) {
        Swal.fire({
          text: "Please Enter Name of the Designated Officer",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.addressOfDesignatedOfficer?.trim()) {
        Swal.fire({
          text: "Please Enter Address of the Designated Officer",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.appealType) {
        Swal.fire({
          text: "Please Select Appeal Type",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      if (!values.applicationNo?.trim()) {
        Swal.fire({
          text: "Please Enter Reference No./Application No.",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

     
      const selectedAppealType = appealTypes.find(
        (item) => String(item.APPEALTYPEID) === String(values.appealType),
      );

      const firstAppealData = {
        ...values,

        appealTypeId: selectedAppealType?.APPEALTYPEID || "",
        appealTypeName: selectedAppealType?.APPEALTYPE || "",
        userId,
      };


      navigate("/app/FrmFirstAppealDocUpload", {
        state: {
            firstAppealData: values,
            ulbId,
            userId,
        },
    });
    } catch (error) {
      console.error("Error while proceeding:", error);

      Swal.fire({
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-5 lg:py-6"
          >
            <Card className="w-full border shadow-sm">
              <CardHeader className="border-b px-3 sm:px-5 md:px-6 py-3 sm:py-4">
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  First Appeal
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 sm:p-5 md:p-6 lg:p-7">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="First Appellate Authority Designation"
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="firstAppellateAuthorityDesignation"
                      value={values.firstAppellateAuthorityDesignation}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="First Appellate Authority Office Address"
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="firstAppellateAuthorityOfficeAddress"
                      value={values.firstAppellateAuthorityOfficeAddress}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="Name of Eligible Person"
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="nameOfEligiblePerson"
                      value={values.nameOfEligiblePerson}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="Address of Eligible Person"
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="addressOfEligiblePerson"
                      value={values.addressOfEligiblePerson}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-5">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="Name of the Designated Officer"
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="nameOfDesignatedOfficer"
                      value={values.nameOfDesignatedOfficer}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="Address of the Designated Officer"
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="addressOfDesignatedOfficer"
                      value={values.addressOfDesignatedOfficer}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 lg:gap-6 mb-5">

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="Appeal Type"
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Select
                      value={values.appealType}
                      onValueChange={(value) =>
                        setFieldValue("appealType", value)
                      }
                    >
                      <SelectTrigger className="w-full h-9 sm:h-10 overflow-hidden">
                        <SelectValue placeholder="-- Select Option --" />
                      </SelectTrigger>

                      <SelectContent>
                        {appealTypes.map((appeal) => (
                          <SelectItem
                            key={appeal.APPEALTYPEID}
                            value={String(appeal.APPEALTYPEID)}
                          >
                            {appeal.APPEALTYPE}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                    <div className="w-full md:w-40 lg:w-74 shrink-0 flex items-center justify-between">
                      <Label
                        className="text-sm sm:text-base text-nowrap"
                        text="Reference No./Application No."
                        required
                      />

                      <span className="hidden md:block">:</span>
                    </div>

                    <Input
                      name="applicationNo"
                      value={values.applicationNo}
                      onChange={handleChange}
                      className="w-full h-9 sm:h-10"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center pt-3">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5"
                  >
                    Next
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

export default FrmFirstAppeal;
