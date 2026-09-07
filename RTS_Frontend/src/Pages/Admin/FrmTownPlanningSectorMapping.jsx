
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ShadCNTable from "@/components/ui/table";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FrmTownPlanningSectorMapping = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // [{ sectorId, sectorName, checked }]
  const [sectors, setSectors] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const tableHeaders = ["Select", "Sector"];

  const keyMapping = {
    Select: "checked",
    Sector: "sectorName",
  };

  const columnStyles = {
    Select: {
      width: "70px",
    },
  };



  useEffect(() => {
    document.title = "Town Planning Sector Mapping Configuration";

    fetchUserList();
  }, []);



  useEffect(() => {
    if (selectedUser) {
      fetchSectorList(selectedUser);
    } else {
      setSectors([]);
    }
  }, [selectedUser]);


  const fetchUserList = async () => {
    setLoadingUsers(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmTownPlanningSectorMapping/user-list`,
        {
          headers: {
            Authorization: `Bearer ${
              token || localStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.data?.ok && response.data?.data) {
        const data =
          response.data.data?.data ||
          response.data.data ||
          [];

        setUserList(Array.isArray(data) ? data : []);
      } else {
        setUserList([]);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);

      setUserList([]);
    } finally {
      setLoadingUsers(false);
    }
  };



  const fetchSectorList = async (userId) => {
    setLoadingSectors(true);

    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmTownPlanningSectorMapping/sector-list`,
        {
          params: {
            userId,
          },

          headers: {
            Authorization: `Bearer ${
              token || localStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.data?.ok && response.data?.data) {
        const data =
          response.data.data?.data ||
          response.data.data ||
          [];

        const mappedSectors = (
          Array.isArray(data) ? data : []
        ).map((sector) => ({
          sectorId:
            sector.SECTORID ||
            sector.sectorId ||
            sector.id,

          sectorName:
            sector.SECTORNAME ||
            sector.sectorName ||
            sector.name ||
            "",

          checked:
            Number(
              sector.ISMAPPED ??
                sector.isMapped ??
                0
            ) === 1 || sector.checked === true,
        }));

        setSectors(mappedSectors);
      } else {
        setSectors([]);
      }
    } catch (error) {
      console.error(
        "Error fetching sector list:",
        error
      );

      setSectors([]);
    } finally {
      setLoadingSectors(false);
    }
  };


  const handleRowCheck = (row, checked) => {
    setSectors((previousSectors) =>
      previousSectors.map((sector) =>
        sector.sectorId === row.sectorId
          ? {
              ...sector,
              checked,
            }
          : sector
      )
    );
  };



  const handleSelectAll = (checked) => {
    const isChecked = checked === true;

    setSectors((previousSectors) =>
      previousSectors.map((sector) => ({
        ...sector,
        checked: isChecked,
      }))
    );
  };


  const handleSubmit = async () => {
    if (!selectedUser) {
      Swal.fire({
        text: "Please select a user.",
        icon: "warning",
        confirmButtonColor: "#1e3a8a",
      });

      return;
    }

    const selectedSectors = sectors
      .filter((sector) => sector.checked)
      .map((sector) => sector.sectorId);

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmTownPlanningSectorMapping/save-mapping`,
        {
          userId: selectedUser,
          sectorIds: selectedSectors,
        },
        {
          headers: {
            Authorization: `Bearer ${
              token || localStorage.getItem("token")
            }`,
          },
        }
      );

      if (response.data?.ok) {
        Swal.fire({
          text: "Sector mapping saved successfully.",
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });

        // Reload sector mapping after successful save
        fetchSectorList(selectedUser);
      } else {
        Swal.fire({
          text:
            response.data?.message ||
            "Failed to save sector mapping.",
          icon: "error",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error(
        "Error saving sector mapping:",
        error
      );

      Swal.fire({
        text:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="border shadow-sm">

    

        <CardHeader className="border-b">
          <CardTitle className="boxHead text-lg font-semibold">
            Town Planning Sector Mapping Configuration
          </CardTitle>
        </CardHeader>



        <CardContent className="space-y-5 p-4 sm:p-6">


          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">

            <Label
              htmlFor="user-select"
              text="User :"
              required
              className="
                shrink-0
                text-sm
                font-medium
                text-gray-700
                sm:w-28
                sm:text-right
              "
            />

            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
              disabled={loadingUsers || submitting}
            >
              <SelectTrigger
                id="user-select"
                className="h-9 w-full sm:w-72"
              >
                <SelectValue placeholder="--- Select Option ---" />
              </SelectTrigger>

              <SelectContent position="popper">

                {loadingUsers ? (

                  <SelectItem
                    value="__loading__"
                    disabled
                  >
                    Loading...
                  </SelectItem>

                ) : userList.length === 0 ? (

                  <SelectItem
                    value="__no_data__"
                    disabled
                  >
                    No users available
                  </SelectItem>

                ) : (

                  userList.map((userItem) => {
                    const userId =
                      userItem.USERID ||
                      userItem.userId ||
                      userItem.id;

                    const userName =
                      userItem.USERNAME ||
                      userItem.userName ||
                      userItem.name ||
                      userItem.USERID;

                    return (
                      <SelectItem
                        key={userId}
                        value={String(userId)}
                      >
                        {userName}
                      </SelectItem>
                    );
                  })

                )}

              </SelectContent>
            </Select>

          </div>


          <AnimatePresence>

            {selectedUser && (

              <motion.div
                key="sector-table"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >

                {loadingSectors ? (

                  <div className="flex items-center justify-center py-10">

                    <div className="text-center">

                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-900" />

                      <p className="mt-2 text-sm text-gray-500">
                        Loading sectors...
                      </p>

                    </div>

                  </div>

                ) : (

                  <ShadCNTable
                    headers={tableHeaders}
                    data={sectors}
                    keyMapping={keyMapping}
                    columnStyles={columnStyles}
                    pagination={false}
                    className="w-full"
                    onSelectAllChange={handleSelectAll}
                    onRowCheckChange={handleRowCheck}
                  />

                )}

              </motion.div>

            )}

          </AnimatePresence>


          <div className="flex justify-center gap-3 pt-1">

            {selectedUser && (

              <Button
                type="button"
                variant="default"
              
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  loadingSectors ||
                  loadingUsers
                }
              >

                {submitting ? (

                  <span className="flex items-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />

                    Saving...

                  </span>

                ) : (

                  "Submit"

                )}

              </Button>

            )}


            <Button
              type="button"
              variant="outline"
              path="/"
              disabled={submitting}
            >
              Back
            </Button>

          </div>

        </CardContent>

      </Card>
    </motion.div>
  );
};

export default FrmTownPlanningSectorMapping;
