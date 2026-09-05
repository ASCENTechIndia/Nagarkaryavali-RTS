import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const FrmTradeCtgryTypeCnfgMst = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { mode, categoryId, categoryTypeId } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);
  const [tradeCategories, setTradeCategories] = useState([]);
  const [tradeTypes, setTradeTypes] = useState([]);

  const [formData, setFormData] = useState({
    categoryTradeId: "",
    tradeTypeId: "",
    type: "Trade",
    status: "Y",
    jwalan: "Y"
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const modeNumber = parseInt(mode);
  const isEditMode = modeNumber === 2;

  const fetchTradeCategories = async () => {
    try {
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/api/Tradetypeconfig/categories`,
        data: {},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      if (response.data?.data) {
        let categoriesData = [];
        
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          categoriesData = response.data.data.data;
        } else if (response.data.data.rows && Array.isArray(response.data.data.rows)) {
          categoriesData = response.data.data.rows;
        } else if (response.data.data.result && Array.isArray(response.data.data.result)) {
          categoriesData = response.data.data.result;
        } else if (Array.isArray(response.data.data)) {
          categoriesData = response.data.data;
        } else {
          for (let key in response.data.data) {
            if (Array.isArray(response.data.data[key])) {
              categoriesData = response.data.data[key];
              break;
            }
          }
        }

        if (categoriesData && categoriesData.length > 0) {
          const categories = categoriesData.map((item, index) => {
            const value = item.NUM_CATEGORY_CATGRYID || 
                         item.num_category_catgryid || 
                         item.CATEGORYID || 
                         item.categoryId || 
                         "";
            const label = item.VAR_TRADECATEGORY_NAME || 
                         item.var_tradecategory_name || 
                         item.BUISNESSNM || 
                         item.businessName || 
                         "";
            
            return {
              key: String(value || `category-${index}`),
              value: String(value),
              label: String(label || `Category ${index + 1}`)
            };
          }).filter(cat => cat.value && cat.value.trim() !== "" && cat.label && cat.label.trim() !== "");
          
          setTradeCategories(categories);
        }
      }
    } catch (error) {
      console.error("Error fetching trade categories:", error);
    }
  };

  const fetchTradeTypes = async (categoryId) => {
    try {
      if (!categoryId) {
        setTradeTypes([]);
        return;
      }

      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/api/Tradetypeconfig/trade-types`,
        data: { categoryId: categoryId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      if (response.data?.data) {
        let typesData = [];
        
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          typesData = response.data.data.data;
        } else if (response.data.data.rows && Array.isArray(response.data.data.rows)) {
          typesData = response.data.data.rows;
        } else if (response.data.data.result && Array.isArray(response.data.data.result)) {
          typesData = response.data.data.result;
        } else if (Array.isArray(response.data.data)) {
          typesData = response.data.data;
        } else {
          for (let key in response.data.data) {
            if (Array.isArray(response.data.data[key])) {
              typesData = response.data.data[key];
              break;
            }
          }
        }

        if (typesData && typesData.length > 0) {
          const types = typesData.map((item, index) => {
            const value = item.NUM_TRADETYPE_ID || 
                         item.num_tradetype_id || 
                         item.TRADETYPEID || 
                         item.tradeTypeId || 
                         "";
            const label = item.VAR_TRADETYPE_NAME || 
                         item.var_tradetype_name || 
                         item.TRADETYPENAME || 
                         item.tradeTypeName || 
                         "";
            
            return {
              key: String(value || `type-${index}`),
              value: String(value),
              label: String(label || `Type ${index + 1}`)
            };
          }).filter(type => type.value && type.value.trim() !== "" && type.label && type.label.trim() !== "");
          
          setTradeTypes(types);
        }
      }
    } catch (error) {
      console.error("Error fetching trade types:", error);
    }
  };

  const fetchCategoryTypeConfig = async (catId, catTypeId) => {
    try {
      
      if (!catId || !catTypeId) {
        console.error("Missing categoryId or categoryTypeId");
        Swal.fire({
          text: "Missing required data for editing",
          confirmButtonColor: "#1e3a8a",
        });
        return;
      }

      setIsLoading(true);
      Swal.fire({
        title: "Loading...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/api/Tradetypeconfig/category-types`,
        data: {
          categoryId: catId,
          categoryTypeId: catTypeId
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      Swal.close();

      if (response.data?.data) {
        let configData = [];
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          configData = response.data.data.data;
        } else if (response.data.data.rows && Array.isArray(response.data.data.rows)) {
          configData = response.data.data.rows;
        } else if (Array.isArray(response.data.data)) {
          configData = response.data.data;
        }

        if (configData && configData.length > 0) {
          const record = configData[0];
          
          const categoryValue = record.CATEGORYID || 
                               record.categoryid || 
                               record.NUM_CATEGORYTYPE_CATGRYID || 
                               record.num_categorytype_catgryid || 
                               "";
          
          const typeValue = record.TYPE || 
                           record.type || 
                           record.VAR_CATEGORYTYPE_TYPE || 
                           record.var_categorytype_type || 
                           "";
          
          const tradeTypeIdValue = record.CATGTYPID || 
                                  record.catgtypid || 
                                  record.NUM_CATEGORYTYPE_CATGTYPID || 
                                  record.num_categorytype_catgtypid || 
                                  "";
          
          const trimmedTypeValue = String(typeValue).trim();
          
          let finalTypeValue = "Trade";
          if (trimmedTypeValue === "Trade") {
            finalTypeValue = "Trade";
          } else if (trimmedTypeValue === "Storage") {
            finalTypeValue = "Storage";
          } else {
            if (trimmedTypeValue.toLowerCase() === "trade") {
              finalTypeValue = "Trade";
            } else if (trimmedTypeValue.toLowerCase() === "storage") {
              finalTypeValue = "Storage";
            } else {
              if (trimmedTypeValue === "Y") {
                finalTypeValue = "Trade";
              } else {
                finalTypeValue = "Trade";
              }
            }
          }
          
          setFormData({
            categoryTradeId: String(categoryValue),
            tradeTypeId: String(tradeTypeIdValue),
            type: finalTypeValue,
            status: record.STATUS || record.status || "Y",
            jwalan: record.JWALANSHILSTAT || record.jwalanshilstat || "Y"
          });

          if (categoryValue) {
            await fetchTradeTypes(categoryValue);
          }
        } else {
          Swal.fire({
            text: "No record found",
            confirmButtonColor: "#1e3a8a",
          });
        }
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching category type config:", error);
      Swal.fire({
        text: "Error fetching data. Please try again.",
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = async (e) => {
    const selectedValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      categoryTradeId: selectedValue,
      tradeTypeId: ""
    }));

    if (selectedValue) {
      await fetchTradeTypes(selectedValue);
    } else {
      setTradeTypes([]);
    }
  };

  const handleRadioChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categoryTradeId) {
      Swal.fire({
        text: "Please Select Business Category",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    if (!formData.tradeTypeId) {
      Swal.fire({
        text: "Please Select Business Type",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Saving...",
        text: "Please wait",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload = {
        userId: user?.userId || user?.EmpUserName || "admin",
        categoryTradeId: formData.categoryTradeId,
        tradeTypeId: formData.tradeTypeId,
        type: formData.type,
        jwalan: formData.jwalan,
        status: formData.status,
        mode: isEditMode ? 2 : 1
      };

      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/api/Tradetypeconfig/tradetype-config-save`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem("token")}`,
        },
      });

      Swal.close();

      if (response.data) {
        
        const responseData = response.data;
        const ok = responseData.ok;
        const message = responseData.message;
        const data = responseData.data;

        let errorCode = null;
        let errorMsg = null;
        let isError = false;

        if (data?.errorCode !== undefined && data?.errorCode !== null) {
          errorCode = data.errorCode;
          errorMsg = data.message || data.data?.errorMsg || data.errorMsg;
        } else if (data?.data?.errorCode !== undefined && data?.data?.errorCode !== null) {
          errorCode = data.data.errorCode;
          errorMsg = data.data.errorMsg || data.message;
        }

        if (errorCode === -100 || errorCode === 0 || errorCode === null || errorCode === undefined) {

          const successMessage = data?.message || data?.data?.errorMsg || (isEditMode ? "Updated successfully" : "Saved successfully");
          const cleanSuccessMessage = successMessage.replace(/Message Code\s*:-?\d+\s*/, '');
          
          Swal.fire({
            text: cleanSuccessMessage,
            confirmButtonColor: "#1e3a8a",
          }).then(() => {
            window.location.href = "/app/FrmTradeCtgryTypeCnfgList";
          });
        } else {
          const cleanMessage = (errorMsg || "An error occurred").replace(/Message Code\s*:-?\d+\s*/, '');
          
          Swal.fire({
            text: cleanMessage,
            confirmButtonColor: "#1e3a8a",
          });
        }
      } else {
        Swal.fire({
          text: "Invalid response from server",
          confirmButtonColor: "#1e3a8a",
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Save Error:", error);
      
      let errorMessage = "Error saving data. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Swal.fire({
        text: errorMessage,
        confirmButtonColor: "#1e3a8a",
      });
    }
  };

  const handleBack = () => {
    navigate("/app/FrmTradeCtgryTypeCnfgList");
  };

  useEffect(() => {
    fetchTradeCategories();

    if (isEditMode) {
      if (categoryId && categoryTypeId) {
        fetchCategoryTypeConfig(categoryId, categoryTypeId);
      } else {
        console.error("Missing categoryId or categoryTypeId for edit mode");
        Swal.fire({
          text: "Missing required data for editing",
          confirmButtonColor: "#1e3a8a",
        });
      }
    }
  }, []);

  return (
    <div className="p-2 sm:p-4">
      <Card className="border shadow-sm">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-xl font-semibold">
            Trade Type Configuration Master
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          <form onSubmit={handleSubmit}>
              <div className="w-full max-w-[100%]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                  <div className="grid sm:grid-cols-3 grid-cols-1 items-center gap-6">
                    <Label className="whitespace-nowrap required">
                      Business Category:
                    </Label>
                    <div className="col-span-2">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.categoryTradeId}
                        onChange={handleCategoryChange}
                        disabled={isEditMode}
                        required
                      >
                        <option value="">-- Select Option --</option>
                        {tradeCategories.map((category) => (
                          <option key={category.key || category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-6">
                    <Label className="whitespace-nowrap required">
                      Business Type:
                    </Label>
                    <div className="col-span-2">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.tradeTypeId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, tradeTypeId: e.target.value }))}
                        disabled={isEditMode || !formData.categoryTradeId}
                        required
                      >
                        <option value="">-- Select Type --</option>
                        {tradeTypes.map((type) => (
                          <option key={type.key || type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-6">
                  <div className="grid sm:grid-cols-3 grid-cols-1 items-center gap-6">
                    <Label className="whitespace-nowrap required">
                      Type:
                    </Label>
                    <div className="col-span-2 flex gap-4 lg:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="type"
                          value="Trade"
                          checked={formData.type === "Trade"}
                          onChange={() => handleRadioChange("type", "Trade")}
                          className="h-4 w-4"
                        />
                        Trade
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="type"
                          value="Storage"
                          checked={formData.type === "Storage"}
                          onChange={() => handleRadioChange("type", "Storage")}
                          className="h-4 w-4"
                        />
                        Storage
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 items-center gap-6">
                    <Label className="whitespace-nowrap required">
                      ज्वलनशील पदार्थांचा:
                    </Label>
                    <div className="col-span-2 flex gap-4 lg:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="jwalan"
                          value="Y"
                          checked={formData.jwalan === "Y"}
                          onChange={() => handleRadioChange("jwalan", "Y")}
                          className="h-4 w-4"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="jwalan"
                          value="N"
                          checked={formData.jwalan === "N"}
                          onChange={() => handleRadioChange("jwalan", "N")}
                          className="h-4 w-4"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-6">
                  <div className="grid sm:grid-cols-3 grid-cols-1 items-center gap-6">
                    <Label className="whitespace-nowrap required ">
                      Status:
                    </Label>
                    <div className="flex gap-4 lg:gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="status"
                          value="Y"
                          checked={formData.status === "Y"}
                          onChange={() => handleRadioChange("status", "Y")}
                          className="h-4 w-4"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          name="status"
                          value="N"
                          checked={formData.status === "N"}
                          onChange={() => handleRadioChange("status", "N")}
                          className="h-4 w-4"
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            <div className="mt-8">
              <div className="flex justify-center gap-4">
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700 min-w-[100px]"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : isEditMode ? "Update" : "Submit"}
                </Button>
                <Button
                  className="bg-gray-200 text-black hover:bg-gray-300 min-w-[100px]"
                  type="button"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrmTradeCtgryTypeCnfgMst;