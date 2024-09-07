// models/PanitiaModel.js
const pool = require("../config/db");
const sha1 = require("crypto-js/sha1");

class PanitiaModel {
  static async createPanitia(nama_panitia, rate_panitia, id_role) {
    try {
      const query =
        "INSERT INTO panitia (nama_panitia, rate_panitia, id_role) VALUES (?, ?, ?)";
      const result = await pool.query(query, [
        nama_panitia,
        rate_panitia,
        id_role,
      ]);
      console.log(result);
      return { success: true, message: "Panitia created successfully" };
    } catch (error) {
      console.error("Error creating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async pesertatugasakhirzoom(id_kegiatan, id_panitia, filePath) {
    const xlsx = require("xlsx");
    let workbook;
    const path = require("path");
    const fileLocation = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(filePath)
    );
    try {
      const fs = require("fs");

      workbook = xlsx.readFile(fileLocation);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error("File tidak ditemukan:", fileLocation);
        throw new Error("File tidak ditemukan: " + fileLocation);
      } else {
        throw error;
      }
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    try {
      console.log(data.slice(3));
      for (const row of data.slice(4)) {
        // Mulai dari baris ke-5
        const nameColumn = row["Meeting ID"];
        let NPM = "0";
        let Nama = nameColumn;
        if (nameColumn && nameColumn.includes(" - ")) {
          const parts = nameColumn.split(" - ");
          NPM = parts[0].trim();
          Nama = parts[1].trim();
        } else if (
          nameColumn &&
          nameColumn.includes("(") &&
          nameColumn.includes(")")
        ) {
          const start = nameColumn.indexOf("(") + 1;
          const end = nameColumn.indexOf(")");
          Nama = nameColumn.substring(start, end).trim();
        }

        const Email = row["Topic"];
        const Durasi = row["Start Time"];
        const Guest = row["Guests"];
        const Status = "Peserta";
        const Semester = "0";

        // console.log(NPM);
        // console.log(Nama);
        //console.log(Email);
        //console.log(Durasi);
        //console.log(Guest);
        //console.log(Status);
        //console.log(Semester);
        // Check if NPM already exists
        const checkQuery =
          NPM === "0"
            ? "SELECT COUNT(*) as count FROM daftar_peserta WHERE nama = ?"
            : "SELECT COUNT(*) as count FROM daftar_peserta WHERE npm = ?";
        const queryParam = NPM === "0" ? Nama : NPM;
        pool.query(checkQuery, [queryParam], (error, results) => {
          if (error) {
            console.error("Error executing query:", error);
            throw new Error("Error executing query");
          }

          const count = results[0].count;
          //console.log(count);
          if (count === 0) {
            // Insert new record if NPM does not exist
            const insertQuery =
              "INSERT INTO daftar_peserta (npm, nama, email ,no_semester, status_peserta) VALUES (?, ?, ?, ?,?)";
            pool.query(
              insertQuery,
              [NPM, Nama, Email, Semester, Status],
              (error, results) => {
                if (error) {
                  console.error("Error executing insert query:", error);
                  throw new Error("Error executing insert query");
                } else {
                  // Insert ke tabel detail_peserta setelah mendapatkan id_peserta dari insert sebelumnya
                  const idPeserta = results.insertId;
                  const checkExistDetailQuery =
                    "SELECT COUNT(*) AS count FROM detail_peserta WHERE id_peserta = ? AND id_kegiatan = ?";
                  pool.query(
                    checkExistDetailQuery,
                    [idPeserta, id_kegiatan],
                    (checkError, checkResults) => {
                      if (checkError) {
                        console.error(
                          "Error checking existing detail:",
                          checkError
                        );
                        throw new Error("Error checking existing detail");
                      }
                      if (checkResults[0].count === 0) {
                        const insertDetailQuery =
                          "INSERT INTO detail_peserta (id_peserta, id_kegiatan, join_time, leave_time, duration) VALUES (?, ?, NULL, NULL, ?)";
                        pool.query(
                          insertDetailQuery,
                          [idPeserta, id_kegiatan, Durasi],
                          (detailError, detailResults) => {
                            if (detailError) {
                              console.error(
                                "Error executing detail insert query:",
                                detailError
                              );
                              throw new Error(
                                "Error executing detail insert query"
                              );
                            }
                            if (NPM !== 0) {
                              const checkAccountQuery =
                                "SELECT COUNT(*) as count FROM akun WHERE username = ?";
                              pool.query(
                                checkAccountQuery,
                                [NPM],
                                (error, results) => {
                                  if (error) {
                                    console.error(
                                      "Error executing account check query:",
                                      error
                                    );
                                    throw new Error(
                                      "Error executing account check query"
                                    );
                                  }
                                  const count = results[0].count;
                                  if (count === 0) {
                                    console.log("NPM update" + NPM);
                                    console.log(idpes);
                                    const pass = NPM.toString();
                                    const hashedPassword =
                                      sha1(pass).toString();
                                    console.log(hashedPassword);
                                    const insertAccountQuery =
                                      "INSERT INTO akun (username, password, nama, id_role, id_peserta) VALUES (?, ?, ?, ?, ?)";
                                    pool.query(
                                      insertAccountQuery,
                                      [
                                        NPM,
                                        hashedPassword,
                                        Nama,
                                        31,
                                        idPeserta,
                                      ],
                                      (error, results) => {
                                        if (error) {
                                          console.error(
                                            "Error executing insert account query:",
                                            error
                                          );
                                          throw new Error(
                                            "Error executing insert account query"
                                          );
                                        }
                                      }
                                    );
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          } else {
            const checkQuery =
              NPM === "0"
                ? "SELECT id_peserta FROM daftar_peserta WHERE nama = ?"
                : "SELECT id_peserta FROM daftar_peserta WHERE npm = ?";
            const queryParam = NPM === "0" ? Nama : NPM;
            pool.query(
              checkQuery,
              [queryParam],
              (searchError, searchResults) => {
                if (searchError) {
                  console.error("Error executing search query:", searchError);
                  throw new Error("Error executing search query");
                }

                if (searchResults.length > 0) {
                  const idPeserta = searchResults[0].id_peserta;

                  const updateQuery =
                    "UPDATE daftar_peserta SET email = ? WHERE id_peserta = ?";
                  pool.query(
                    updateQuery,
                    [Email, idPeserta],
                    (error, results) => {
                      if (error) {
                        console.error("Error executing update query:", error);
                        throw new Error("Error executing update query");
                      } else {
                        if (NPM > 0) {
                          const checkAccountQuery =
                            "SELECT COUNT(*) as count FROM akun WHERE username = ?";
                          pool.query(
                            checkAccountQuery,
                            [NPM],
                            (error, results) => {
                              if (error) {
                                console.error(
                                  "Error executing account check query:",
                                  error
                                );
                                throw new Error(
                                  "Error executing account check query"
                                );
                              }
                              const count = results[0].count;
                              if (count === 0) {
                                console.log("NPM update" + NPM);
                                console.log(idPeserta);
                                const pass = NPM.toString();
                                const hashedPassword = sha1(pass).toString();
                                console.log(hashedPassword);
                                const insertAccountQuery =
                                  "INSERT INTO akun (username, password, nama, id_role, id_peserta) VALUES (?, ?, ?, ?, ?)";
                                pool.query(
                                  insertAccountQuery,
                                  [NPM, hashedPassword, Nama, 31, idPeserta],
                                  (error, results) => {
                                    if (error) {
                                      console.error(
                                        "Error executing insert account query:",
                                        error
                                      );
                                      throw new Error(
                                        "Error executing insert account query"
                                      );
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    }
                  );

                  const checkExistQuery =
                    "SELECT COUNT(*) AS count FROM detail_peserta WHERE id_peserta = ? AND id_kegiatan = ?";
                  pool.query(
                    checkExistQuery,
                    [idPeserta, id_kegiatan],
                    (checkError, checkResults) => {
                      if (checkError) {
                        console.error(
                          "Error checking existing detail:",
                          checkError
                        );
                        throw new Error("Error checking existing detail");
                      }
                      if (checkResults[0].count === 0) {
                        const insertDetailQuery =
                          "INSERT INTO detail_peserta (id_peserta, id_kegiatan, join_time, leave_time, duration) VALUES (?, ?, NULL, NULL, ?)";
                        pool.query(
                          insertDetailQuery,
                          [idPeserta, id_kegiatan, Durasi],
                          (detailError, detailResults) => {
                            if (detailError) {
                              console.error(
                                "Error executing detail insert query:",
                                detailError
                              );
                              throw new Error(
                                "Error executing detail insert query"
                              );
                            }
                          }
                        );
                      } else {
                        const updateDetailQuery =
                          "UPDATE detail_peserta SET duration = duration + ? WHERE id_peserta = ? AND id_kegiatan = ?";
                        pool.query(
                          updateDetailQuery,
                          [Durasi, idPeserta, id_kegiatan],
                          (updateError, updateResults) => {
                            if (updateError) {
                              console.error(
                                "Error executing detail update query:",
                                updateError
                              );
                              throw new Error(
                                "Error executing detail update query"
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  console.error("No participant found for given NPM or Name");
                  throw new Error("No participant found for given NPM or Name");
                }
              }
            );
            // Update existing record if NPM exists
          }
        });
      }
      return { success: true, message: "Peserta created successfully" };
    } catch (error) {
      console.error("Error creating Peserta:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async createPesertaTugasAkhir(
    id_kegiatan,
    id_panitia,
    id_Semester,
    filePath
  ) {
    const xlsx = require("xlsx");
    let workbook;
    const idSemester = id_Semester[0];
    console.log("idSemester:");
    const path = require("path");
    const fileLocation = path.join(
      __dirname,
      "..",
      "uploads",
      path.basename(filePath)
    );
    try {
      const fs = require("fs");

      workbook = xlsx.readFile(fileLocation);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.error("File tidak ditemukan:", fileLocation);
        throw new Error("File tidak ditemukan: " + fileLocation);
      } else {
        throw error;
      }
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);
    try {
      for (const row of data) {
        const { NPM, Nama, Status, Semester } = row;

        // Check if NPM already exists
        const checkQuery =
          "SELECT COUNT(*) as count, id_peserta FROM daftar_peserta WHERE npm = ?";
        pool.query(checkQuery, [NPM], (error, results) => {
          if (error) {
            console.error("Error executing query:", error);
            throw new Error("Error executing query");
          }

          const count = results[0].count;
          const idpes = results[0].id_peserta;
          console.log(count);
          if (count === 0) {
            // Insert new record if NPM does not exist
            const insertQuery =
              "INSERT INTO daftar_peserta (npm, nama, no_semester, status_peserta) VALUES (?, ?, ?, ?)";
            pool.query(
              insertQuery,
              [NPM, Nama, idSemester, Status],
              (error, results) => {
                if (error) {
                  console.error("Error executing insert query:", error);
                  throw new Error("Error executing insert query");
                } else {
                  const id_peserta = results.insertId;
                  const pass = NPM.toString();
                  const hashedPassword = sha1(pass).toString();
                  const insertAccountQuery =
                    "INSERT INTO akun (username, password, nama, id_role, id_peserta) VALUES (?, ?, ?, ?, ?)";
                  pool.query(
                    insertAccountQuery,
                    [NPM, hashedPassword, Nama, 31, id_peserta],
                    (error, results) => {
                      if (error) {
                        console.error(
                          "Error executing insert account query:",
                          error
                        );
                        throw new Error("Error executing insert account query");
                      }
                    }
                  );
                }
              }
            );
          } else {
            // Update existing record if NPM exists
            console.log("Nama:", Nama);
            console.log("Status:", Status);
            console.log("NPM:", NPM);
            const updateQuery =
              "UPDATE daftar_peserta SET nama = ?, no_semester = ?, status_peserta = ? WHERE npm = ?";
            pool.query(
              updateQuery,
              [Nama, idSemester, Status, NPM],
              (error, results) => {
                if (error) {
                  console.error("Error executing update query:", error);
                  throw new Error("Error executing update query");
                } else {
                  const checkAccountQuery =
                    "SELECT COUNT(*) as count FROM akun WHERE username = ?";
                  pool.query(checkAccountQuery, [NPM], (error, results) => {
                    if (error) {
                      console.error(
                        "Error executing account check query:",
                        error
                      );
                      throw new Error("Error executing account check query");
                    }
                    const count = results[0].count;
                    if (count === 0) {
                      console.log("NPM update" + NPM);
                      console.log(idpes);
                      const pass = NPM.toString();
                      const hashedPassword = sha1(pass).toString();
                      console.log(hashedPassword);
                      const insertAccountQuery =
                        "INSERT INTO akun (username, password, nama, id_role, id_peserta) VALUES (?, ?, ?, ?, ?)";
                      pool.query(
                        insertAccountQuery,
                        [NPM, hashedPassword, Nama, 31, idpes],
                        (error, results) => {
                          if (error) {
                            console.error(
                              "Error executing insert account query:",
                              error
                            );
                            throw new Error(
                              "Error executing insert account query"
                            );
                          }
                        }
                      );
                    }
                  });
                }
              }
            );
          }
        });
      }
      return { success: true, message: "Peserta created successfully" };
    } catch (error) {
      console.error("Error creating Peserta:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async createRepository(id_kegiatan, nama_file, username, filePath) {
    try {
      const query =
        "INSERT INTO repository (id_kegiatan, nama_file, username, url_file) VALUES (?, ?, ?, ?)";
      const result = await pool.query(query, [
        id_kegiatan,
        nama_file,
        username,
        filePath,
      ]);
      console.log(result);
      return { success: true, message: "Repository created successfully" };
    } catch (error) {
      console.error("Error creating Repository:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async createPanitiaNarasumber(id_kegiatan, id_panitia) {
    try {
      const query =
        "INSERT INTO detail_panitia (id_kegiatan, id_panitia) VALUES (?, ?)";
      const result = await pool.query(query, [id_kegiatan, id_panitia]);
      console.log(result);
      return { success: true, message: "Panitia created successfully" };
    } catch (error) {
      console.error("Error creating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async updatePanitiaDetail(id_detail_panitia, rate_panitia) {
    try {
      const query =
        "UPDATE detail_panitia SET rate_panitia = ? WHERE id_detail_panitia = ?";
      const result = await pool.query(query, [rate_panitia, id_detail_panitia]);
      return { success: true, message: "Panitia updated successfully" };
    } catch (error) {
      console.error("Error updating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async getAllPanitias() {
    try {
      const query =
        "SELECT a.*, b.nm_role FROM panitia a JOIN role b ON a.id_role = b.id_role";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllPanitiasNarasumber() {
    try {
      const query = `SELECT a.*, b.nm_role 
FROM panitia a 
JOIN role b ON a.id_role = b.id_role 
WHERE b.nm_role LIKE '%Narasumber%'`;
      const result = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }
  static async getAllPanitiasNotNarasumber() {
    try {
      const query = `SELECT a.*, b.nm_role 
FROM panitia a 
JOIN role b ON a.id_role = b.id_role 
WHERE b.nm_role NOT LIKE '%Narasumber%'`;
      const result = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllPanitiasData(page, limit, search) {
    try {
      let query = "SELECT COUNT(*) as total FROM panitia"; // Hitung total data
      if (search) {
        query += ` WHERE nama_panitia LIKE '%${search}%'`;
      }

      query += ` ORDER BY id_panitia DESC`;
      const countResult = await new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].total);
          }
        });
      });

      const total = countResult;
      const offset = (page - 1) * limit;

      let queryData = `SELECT a.*, b.nm_role
      FROM panitia a
      JOIN role b ON a.id_role = b.id_role`;
      if (search) {
        queryData += ` WHERE a.nama_panitia LIKE '%${search}%'`;
      }

      queryData += ` ORDER BY id_panitia DESC`;
      queryData += ` LIMIT ${limit} OFFSET ${offset}`;
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { total, items: dataResult };
    } catch (error) {
      console.error("Error getting all roles", error);
      throw new Error("Database error");
    }
  }

  static async getAllPanitiasDataPeserta() {
    try {
      const queryCount = "SELECT COUNT(*) as total FROM daftar_peserta";
      const countResult = await new Promise((resolve, reject) => {
        pool.query(queryCount, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].total);
          }
        });
      });

      const total = countResult;
      const queryData =
        "SELECT * FROM daftar_peserta_ta_semester WHERE status_peserta <> 'Peserta'";
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { total, items: dataResult };
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllPanitiasDataPesertaById(id) {
    try {
      const queryCount =
        "SELECT COUNT(*) as total FROM detail_peserta WHERE id_kegiatan = ?";
      const countResult = await new Promise((resolve, reject) => {
        pool.query(queryCount, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].total);
          }
        });
      });

      const total = countResult;
      const queryData =
        "SELECT dp.*, dtp.duration, dtp.id_detail_peserta,dtp.id_kegiatan FROM detail_peserta dtp JOIN daftar_peserta_ta_semester dp ON dtp.id_peserta = dp.id_peserta WHERE dtp.id_kegiatan = ?";
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { total, items: dataResult };
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllPanitiasDataReposryById(id) {
    const queryCount =
      "SELECT COUNT(*) as total FROM repository WHERE id_kegiatan = ?";
    const countResult = await new Promise((resolve, reject) => {
      pool.query(queryCount, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].total);
        }
      });
    });

    const total = countResult;
    const queryData =
      "SELECT dp.*, r.nama FROM repository dp JOIN akun r  ON dp.username = r.username WHERE dp.id_kegiatan = ?";
    const dataResult = await new Promise((resolve, reject) => {
      pool.query(queryData, [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    return { total, items: dataResult };
  }

  static async getAllPanitiasDataDetail(id, role) {
    try {
      let queryData = "";
      let queryParams = [id];
      if (role == "Narasumber") {
        queryData = `SELECT a.*, b.nama_panitia, c.nm_role
                   FROM detail_panitia a
                   JOIN panitia b ON a.id_panitia = b.id_panitia
                   JOIN role c ON b.id_role = c.id_role
                   WHERE a.id_kegiatan = ? AND c.nm_role LIKE ?`;
        queryParams.push(`%${role}%`);
      } else {
        queryData = `SELECT a.*, b.nama_panitia, c.nm_role
                   FROM detail_panitia a
                   JOIN panitia b ON a.id_panitia = b.id_panitia
                   JOIN role c ON b.id_role = c.id_role
                   WHERE a.id_kegiatan = ? AND c.nm_role NOT LIKE ?`;
        queryParams.push("%Narasumber%");
      }
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, queryParams, (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { items: dataResult };
    } catch (error) {
      console.error("Error getting all roles", error);
      throw new Error("Database error");
    }
  }

  static async getPanitiaById(idPanitia) {
    try {
      const query = "SELECT * FROM panitia where id_panitia = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [idPanitia], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async getAllPanitiasDataKehadiranById(id) {
    try {
      const queryCount =
        "SELECT COUNT(*) as total FROM view_report_kehadiran WHERE status_peserta = ?";
      const countResult = await new Promise((resolve, reject) => {
        pool.query(queryCount, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].total);
          }
        });
      });

      const total = countResult;
      const queryData =
        "SELECT * FROM view_report_kehadiran WHERE status_peserta = ?";
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { total, items: dataResult };
    } catch (error) {
      console.error("Error getting all roles:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async updatePanitia(idPanitia, nama_panitia, rate_panitia, id_role) {
    try {
      const query =
        "UPDATE panitia SET nama_panitia = ?, rate_panitia = ?, id_role = ? WHERE id_panitia = ?";
      const result = await pool.query(query, [
        nama_panitia,
        rate_panitia,
        id_role,
        idPanitia,
      ]);

      return { success: true, message: "Panitia updated successfully" };
    } catch (error) {
      console.error("Error updating Panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deletePanitia(idPanitia) {
    try {
      const query = "DELETE FROM panitia WHERE id_panitia = ?";
      const result = await pool.query(query, [idPanitia]);

      return { success: true, message: "Panitia delte successfully" };
    } catch (error) {
      console.error("Error delete panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deleteRepo(idRepo) {
    try {
      const query = "DELETE FROM repository WHERE id_repository = ?";
      const result = await pool.query(query, [idRepo]);

      return { success: true, message: "Repo delte successfully" };
    } catch (error) {
      console.error("Error delete repo:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deletePanitiadetail(idPanitia) {
    try {
      const query = "DELETE FROM detail_panitia WHERE id_detail_panitia = ?";
      const result = await pool.query(query, [idPanitia]);

      return { success: true, message: "Panitia delte successfully" };
    } catch (error) {
      console.error("Error delete panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }
  static async deletePanitiaDataPeserta(idPanitia) {
    try {
      const query = "DELETE FROM daftar_peserta WHERE id_peserta = ?";
      const result = await pool.query(query, [idPanitia]);

      return { success: true, message: "Panitia delte successfully" };
    } catch (error) {
      console.error("Error delete panitia:", error);
      throw new Error("Database error: " + error.message);
    }
  }
  static async getPanitiaByName(namaPanitia) {
    try {
      const query = "SELECT * FROM panitia where nama_panitia LIKE ? || '%'";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [namaPanitia], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      const roles = result;
      const total = roles.length;
      if (!roles || roles.length === 0) {
        return { total, items: roles };
      }

      return { total, items: roles };
    } catch (error) {
      console.error("Error getting all roles", error);
      throw new Error("Data not found");
    }
  }
}

module.exports = PanitiaModel;
