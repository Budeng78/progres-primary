// resources/js/aplikasi/utils/apiUtils.js

import axios from "@/aplikasi/utils/axios";


/**#############################################
 * Login user menggunakan email + password
############################################### */
export const loginUser = async (email, password) => {
  try {
    // Step 1: Ambil CSRF cookie
    await axios.get("/sanctum/csrf-cookie");

    // Step 2: POST login
    const response = await axios.post("/api/login", {
      email,
      password,
    });

    return response.data; // biasanya user info + token/session
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

  



/** ############################################
 * Ambil semua permission
 ############################################### */
  export const fetchPermissions = async () => {
    try {
      const response = await axios.get("/api/system/permissions");
      return response.data; // bisa array atau { permissions: [] }
    } catch (error) {
      console.error("Fetch permission error:", error.response?.data || error.message);
      throw error;
    }
  };

  export const createPermission = async (data) => {
    try {
      const response = await axios.post("/api/system/permissions", data);
      return response.data;
    } catch (error) {
      console.error("Create permission error:", error.response?.data || error.message);
      throw error;
    }
  };
  export const updatePermission = async (id, data) => {
    try {
      const response = await axios.put(`/api/system/permissions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Update permission error:", error.response?.data || error.message);
      throw error;
    }
  };
  export const deletePermission = async (id) => {
    try {
      const response = await axios.delete(`/api/system/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete permission error:", error.response?.data || error.message);
      throw error;
    }
};



/** ############################################
 * Ambil semua user akses
 ###############################################*/
export const fetchUserAkses = async () => {
  try {
    const response = await axios.get("/api/system/userakses");
    return response.data;
  } catch (error) {
    console.error("Fetch user akses error:", error.response?.data || error.message);
    throw error;
  }
};
export const createUserAkses = async (data) => {
  try {
    const response = await axios.post("/api/system/userakses", data);
    return response.data;
  } catch (error) {
    console.error("Create user akses error:", error.response?.data || error.message);
    throw error;
  }
};
export const updateUserAkses = async (id, data) => {
  try {
    const response = await axios.put(`/api/system/userakses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update user akses error:", error.response?.data || error.message);
    throw error;
  }
};
export const deleteUserAkses = async (id) => {
  try {
    const response = await axios.delete(`/api/system/userakses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete user akses error:", error.response?.data || error.message);
    throw error;
  }
};
export const editUserAkses = async (id, data) => {
  try {
    const response = await axios.put(`/api/system/userakses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Update user akses error:", error.response?.data || error.message);
    throw error;
  }
};


 






  
  export const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/karyawan');
      return response.data;
    } catch (error) {
      console.error("Error fetching employee data:", error);
      // Melempar error agar komponen yang memanggil bisa menanganinya
      throw error;
    }
  };
