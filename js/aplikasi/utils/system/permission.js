/* resources\js\aplikasi\utils\system\permissions.js */

import axios from "@/aplikasi/utils/axios";


/**######################################
 *  Ambil semua permission (GET)
 *  #######################################*/
export const fetchPermissions = async () => {
    try {
        const response = await axios.get("/api/system/permissions");
        return response.data;
    } catch (error) {
        console.error("Fetch permission error:", error.response?.data || error.message);
        throw error;
    }
};

/**######################################
 *  Hapus permission berdasarkan ID (DELETE)
 *  #######################################*/
export const deletePermission = async (permissionId) => {
    try {
        const response = await axios.delete(`/api/system/permissions/${permissionId}`);
        return response.data;
    } catch (error) {
        console.error("Delete permission error:", error.response?.data || error.message);
        throw error;
    }
};

/**######################################
 *  Perbarui permission berdasarkan ID (PUT)
 *  #######################################*/
export const updatePermission = async (permissionId, payload) => {
    try {
        const response = await axios.put(`/api/system/permissions/${permissionId}`, payload);
        return response.data;
    } catch (error) {
        console.error("Update permission error:", error.response?.data || error.message);
        throw error;
    }
};

/**######################################
 *  Buat permission baru (POST)
 *  #######################################*/
export const createPermission = async (permissionData) => {
    try {
        const response = await axios.post("/api/system/permissions", permissionData);
        return response.data;
    } catch (error) {
        console.error("Create permission error:", error.response?.data || error.message);
        throw error;
    }
};