/* resources\js\aplikasi\utils\system\roles.js */

import axios from "@/aplikasi/utils/axios";


/**######################################
   * Ambil semua role
   #######################################*/
  export const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/system/roles");
      return response.data;
    } catch (error) {
      console.error("Fetch role error:", error.response?.data || error.message);
      throw error;
    }    
  };
  export const deleteRole = async (roleId) => {
    try {
      const response = await axios.delete(`/api/system/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error("Delete role error:", error.response?.data || error.message);
      throw error;
    }
  };
  export const updateRole = async (roleId, payload) => {
    try {
      const response = await axios.put(`/api/system/roles/${roleId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Update role error:", error.response?.data || error.message);
      throw error;
    }
  };
  export const createRole = async (roleData) => {
    try {
      const response = await axios.post("/api/system/roles", roleData);
      return response.data;
    } catch (error) {
      console.error("Create role error:", error.response?.data || error.message);
      throw error;
    }
  };
  export const addRole = async (roleData) => {
    try {
      const response = await axios.post("/api/system/roles", roleData);
      return response.data;
    } catch (error) {
      console.error("Create role error:", error.response?.data || error.message);
      throw error;
    }
  };