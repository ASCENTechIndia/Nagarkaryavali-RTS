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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const FrmTownPlanningSectorMapping = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // sectors: [{ sectorId, sectorName, checked }]
  const [sectors, setSectors] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ── On Mount ──────────────────────────────────────────────────────────────
  useEffect(() => {
    document.title = "Town Planning Sector Mapping Configuration";
    fetchUserList();
  }, []);

  // ── Fetch sector list whenever user changes ────────────────────────────────
  useEffect(() => {
    if (selectedUser) {
      fetchSectorList(selectedUser);
    } else {
      setSectors([]);
      setSelectAll(false);
    }
  }, [selectedUser]);

  // ── API: User List ─────────────────────────────────────────────────────────
  const fetchUserList = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/FrmTownPlanningSectorMapping/user-list`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });
      if (response.data?.ok && response.data?.data) {
        const data =
          response.data.data?.data || response.data.data || [];
        setUserList(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ── API: Sector List for selected user (with pre-mapped flags) ─────────────
  const fetchSectorList = async (uid) => {
    setLoadingSectors(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/FrmTownPlanningSectorMapping/sector-list`,
        {
          params: { userId: uid },
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data?.ok && response.data?.data) {
        const data =
          response.data.data?.data || response.data.data || [];
        const mapped = (Array.isArray(data) ? data : []).map((s) => ({
          sectorId: s.SECTORID || s.sectorId || s.id,
          sectorName: s.SECTORNAME || s.sectorName || s.name,
          checked: Number(s.ISMAPPED ?? s.isMapped ?? 0) === 1 || s.checked === true,
        }));
        setSectors(mapped);
        setSelectAll(mapped.length > 0 && mapped.every((s) => s.checked));
      } else {
        setSectors([]);
      }
    } catch (error) {
      console.error("Error fetching sector list:", error);
      setSectors([]);
    } finally {
      setLoadingSectors(false);
    }
  };

  // ── Toggle individual row ──────────────────────────────────────────────────
  const handleRowCheck = (sectorId) => {
    setSectors((prev) => {
      const updated = prev.map((s) =>
        s.sectorId === sectorId ? { ...s, checked: !s.checked } : s
      );
      setSelectAll(updated.length > 0 && updated.every((s) => s.checked));
      return updated;
    });
  };

  // ── Toggle all rows ────────────────────────────────────────────────────────
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    setSectors((prev) => prev.map((s) => ({ ...s, checked })));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
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
      .filter((s) => s.checked)
      .map((s) => s.sectorId);

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/FrmTownPlanningSectorMapping/save-mapping`,
        { userId: selectedUser, sectorIds: selectedSectors },
        {
          headers: {
            Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data?.ok) {
        Swal.fire({
          text: "Sector mapping saved successfully.",
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      } else {
        Swal.fire({
          text: response.data?.message || "Failed to save sector mapping.",
          icon: "error",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      console.error("Error saving sector mapping:", error);
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

  const handleBack = () => navigate(-1);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="border shadow-sm">
        {/* ── Header ── */}
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-semibold boxHead">
            Town Planning Sector Mapping Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-5">
          {/* ── User Select Row ── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Label
              htmlFor="user-select"
              className="sm:w-28 sm:text-right font-medium text-sm text-gray-700 shrink-0"
              text="User :"
              required={true}
            />
            <Select
              value={selectedUser}
              onValueChange={(val) => setSelectedUser(val)}
              disabled={loadingUsers || submitting}
            >
              <SelectTrigger id="user-select" className="w-full sm:w-72 h-9">
                <SelectValue placeholder="--- Select Option ---" />
              </SelectTrigger>
              <SelectContent position="popper">
                {loadingUsers ? (
                  <SelectItem value="__loading__" disabled>
                    Loading...
                  </SelectItem>
                ) : userList.length === 0 ? (
                  <SelectItem value="__no_data__" disabled>
                    No users available
                  </SelectItem>
                ) : (
                  userList.map((u) => (
                    <SelectItem
                      key={u.USERID || u.userId || u.id}
                      value={String(u.USERID || u.userId || u.id)}
                    >
                      {u.USERNAME || u.userName || u.name || u.USERID}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ── Sector Table ── */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div
                key="sector-table"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="overflow-x-auto rounded border border-[#c8a96e]"
              >
                {loadingSectors ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Loading sectors...</p>
                    </div>
                  </div>
                ) : (
                  <Table className="w-full text-sm border-collapse">
                    <TableHeader>
                      <TableRow className="bg-[#1a3a6b] hover:bg-[#1a3a6b]">
                        <TableHead className="w-12 px-3 py-2 text-center border-r border-[#c8a96e] text-white">
                          <Checkbox
                            id="check-all"
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                            disabled={submitting || sectors.length === 0}
                            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#1a3a6b] h-4 w-4 rounded-sm border-2"
                          />
                        </TableHead>
                        <TableHead className="px-4 py-2 text-left font-semibold tracking-wide text-white">
                          Sector
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {sectors.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center py-6 text-gray-500"
                          >
                            No sectors found
                          </TableCell>
                        </TableRow>
                      ) : (
                        sectors.map((sector, idx) => (
                          <TableRow
                            key={sector.sectorId}
                            className={
                              idx % 2 === 0
                                ? "bg-white hover:bg-blue-50 transition-colors"
                                : "bg-[#f5f0e8] hover:bg-blue-50 transition-colors"
                            }
                            style={{ borderBottom: "1px solid #c8a96e" }}
                          >
                            <TableCell className="w-12 px-3 py-2 text-center border-r border-[#c8a96e]">
                              <Checkbox
                                id={`chk-${sector.sectorId}`}
                                checked={sector.checked}
                                onCheckedChange={() =>
                                  handleRowCheck(sector.sectorId)
                                }
                                disabled={submitting}
                                className="border-[#1a3a6b] data-[state=checked]:bg-[#1a3a6b] data-[state=checked]:text-white h-4 w-4 rounded-sm border-2"
                              />
                            </TableCell>
                            <TableCell className="px-4 py-2 text-gray-800">
                              {sector.sectorName}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Action Buttons ── */}
          <div className="flex justify-center gap-3 pt-1">
            {selectedUser && (
              <Button
                type="button"
                variant="default"
                size="sm"
                // className="bg-blue-900 hover:bg-blue-800 text-white px-6"
                onClick={handleSubmit}
                disabled={submitting || loadingSectors || loadingUsers}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
              size="sm"
              // className="px-6"
              onClick={handleBack}
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
