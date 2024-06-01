const pool = require("../config/db");
const moment = require("moment-timezone");
class KegiatanModel {
  static async getAllKegiatan() {
    try {
      const query = `
      SELECT k.*, s.semester, s.tahun_awal, s.tahun_akhir
      FROM kegiatan k
      JOIN semester s ON k.id_semester = s.id_semester
      ORDER BY k.id_kegiatan DESC
    `;
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

  static async getAllKegiatanData(page, limit, search) {
    try {
      let query = "SELECT COUNT(*) as total FROM kegiatan"; // Hitung total data
      if (search) {
        query += ` WHERE judul_topik LIKE '%${search}%'`;
      }
      query += ` ORDER BY id_kegiatan DESC`;
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

      let queryData = `
        SELECT k.*, s.semester, s.tahun_awal, s.tahun_akhir
        FROM kegiatan k
        JOIN semester s ON k.id_semester = s.id_semester
      `;
      if (search) {
        queryData += ` WHERE k.judul_topik LIKE '%${search}%'`;
      }
      queryData += ` ORDER BY id_kegiatan DESC`;
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
      console.error("Error getting all Kegiatan", error);
      throw new Error("Database error");
    }
  }

  static async getKegiatanNarsumData(page, limit, search, id_panitia) {
    try {
      let query = `SELECT COUNT(*) as total FROM view_daftar_kehadiran where id_panitia = '${id_panitia}' or id_panitia is null`; // Hitung total data
      if (search) {
        query += ` and judul_topik LIKE '%${search}%'`;
      }
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

      let queryData = `
        SELECT *
        FROM view_daftar_kehadiran where id_panitia = '${id_panitia}' or id_panitia is null
      `;
      if (search) {
        queryData += ` and judul_topik LIKE '%${search}%'`;
      }
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
      console.error("Error getting all Kegiatan", error);
      throw new Error("Database error");
    }
  }

  static async getKegiatanPeserta(page, limit, search, id_peserta) {
    try {
      let query = `SELECT COUNT(*) as total FROM view_kehadiran_peserta where id_peserta = '${id_peserta}' or id_peserta is null`; // Hitung total data
      if (search) {
        query += ` and judul_topik LIKE '%${search}%'`;
      }
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

      let queryData = `
        SELECT *
        FROM view_kehadiran_peserta where id_peserta = '${id_peserta}' or id_peserta is null
      `;
      if (search) {
        queryData += ` and judul_topik LIKE '%${search}%'`;
      }
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
      console.error("Error getting all Kegiatan", error);
      throw new Error("Database error");
    }
  }

  static async getKegiatanByNama(nama) {
    try {
      const query = "SELECT * FROM kegiatan WHERE nama = ?";
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [nama], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error getting kegiatan by nama:", error);
      throw new Error("Database error:", error.message);
    }
  }

  static async createKegiatan(kegiatanData) {
    try {
      const {
        id_semester,
        judul_topik,
        link_webinar,
        tanggal_kegiatan,
        waktu_mulai,
        waktu_selesai,
      } = kegiatanData;

      const semesterQuery = `
      SELECT tanggal_awal, tanggal_akhir FROM semester WHERE id_semester = ?
    `;
      const semesterResult = await new Promise((resolve, reject) => {
        pool.query(
          semesterQuery,
          [id_semester],
          (searchError, searchResults) => {
            if (searchError) {
              reject(searchError);
            } else {
              resolve(searchResults);
            }
          }
        );
      });

      const tanggalAwal = moment
        .utc(semesterResult[0].tanggal_awal)
        .tz("Asia/Jakarta")
        .toDate();
      const tanggalAkhir = moment
        .utc(semesterResult[0].tanggal_akhir)
        .tz("Asia/Jakarta")
        .toDate();

      const tanggalKegiatan = moment
        .utc(tanggal_kegiatan)
        .tz("Asia/Jakarta")
        .toDate();
      if (tanggalKegiatan >= tanggalAwal && tanggalKegiatan <= tanggalAkhir) {
        const query = `
        INSERT INTO kegiatan (id_semester, judul_topik, link_webinar, tanggal_kegiatan, waktu_mulai, waktu_selesai)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

        const result = await new Promise((resolve, reject) => {
          pool.query(
            query,
            [
              id_semester,
              judul_topik,
              link_webinar,
              tanggal_kegiatan,
              waktu_mulai,
              waktu_selesai,
            ],
            (searchError, searchResults) => {
              if (searchError) {
                reject(searchError);
              } else {
                resolve(searchResults);
              }
            }
          );
        });

        if (result.affectedRows > 0) {
          return {
            success: true,
            message: "Data kegiatan berhasil ditambahkan",
          };
        } else {
          return { success: false, message: "Gagal menambahkan data kegiatan" };
        }
      } else {
        return {
          success: false,
          message:
            "Tanggal kegiatan tidak memenuhi kriteria tanggal di semester",
        };
      }
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        // Handle kesalahan duplikat di sini
        return {
          success: false,
          message: "Gagal menambahkan data kegiatan: Duplikat entri",
        };
      } else {
        throw new Error(error.message);
      }
    }
  }

  static async createLaporan(kegiatanData) {
    try {
      const { bulan, tahun } = kegiatanData;

      const query =
        "SELECT COUNT(*) as total FROM kegiatan WHERE MONTH(tanggal_kegiatan) = ? AND YEAR(tanggal_kegiatan) = ?"; // Hitung total data
      const countResult = await new Promise((resolve, reject) => {
        pool.query(query, [bulan, tahun], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].total);
          }
        });
      });

      const total = countResult;

      const queryData = `
        SELECT * FROM kegiatan WHERE MONTH(tanggal_kegiatan) = ? AND YEAR(tanggal_kegiatan) = ?
      `;
      const dataResult = await new Promise((resolve, reject) => {
        pool.query(queryData, [bulan, tahun], (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });

      return { total, items: dataResult };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        // Handle kesalahan duplikat di sini
        return {
          success: false,
          message: "Gagal menambahkan data kegiatan: Duplikat entri",
        };
      } else {
        throw new Error(error.message);
      }
    }
  }

  static async downloadKegiatan(id_kegiatan, id_panitia) {
    // Logika untuk download kegiatan
    try {
      const query = `
        SELECT judul_topik, tanggal_kegiatan, waktu_mulai, waktu_selesai 
        FROM kegiatan 
        WHERE id_kegiatan = ?
      `;
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [id_kegiatan], async (error, resultske, fields) => {
          if (error) {
            reject(error);
          } else {
            const querySiswa = `
            select * from
              view_pdf_panitia 
              WHERE id_panitia = ?
            `;
            const siswaResults = await new Promise((resolve, reject) => {
              pool.query(querySiswa, [id_panitia], (error, results, fields) => {
                if (error) {
                  reject(error);
                } else {
                  const promises = results.map((siswaResult, index) => {
                    return new Promise((resolve, reject) => {
                      const PDFDocument = require("pdfkit");
                      const fs = require("fs");
                      const doc = new PDFDocument({
                        margin: 50,
                        size: "A4",
                        layout: "landscape",
                      });

                      const filePath = `uploads/sertifikat/${resultske[0].judul_topik.replace(
                        / /g,
                        "_"
                      )}-${siswaResult.nama_panitia
                        .replace(/ /g, "_")
                        .replace(/\./g, "_")}.pdf`;
                      console.log(filePath);
                      console.log(
                        `Generate ke-${index + 1} untuk ${
                          siswaResult.nama_panitia
                        }`
                      );
                      if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                      }
                      doc.pipe(fs.createWriteStream(filePath));

                      // Menambahkan border double dan header
                      doc.rect(50, 50, 692, 500).lineWidth(1).stroke();
                      doc.rect(55, 55, 682, 490).lineWidth(1).stroke(); // Border dalam untuk efek double
                      doc.image("assets/logo.png", 356, 60, { width: 130 }); // Logo di tengah
                      doc.moveDown(8); // Menyesuaikan posisi turun lebih banyak
                      doc
                        .fontSize(25)
                        .text("Sertifikat Partisipasi", { align: "center" });
                      doc.moveDown(0.5);
                      doc
                        .fontSize(20)
                        .text(
                          `Telah Menjadi Narasumber webinar dengan topik:`,
                          {
                            align: "center",
                          }
                        );
                      doc
                        .fontSize(25)
                        .text(resultske[0].judul_topik, { align: "center" });
                      doc.moveDown(0.5);

                      // Menambahkan detail kegiatan
                      doc
                        .fontSize(15)
                        .text(
                          `Tanggal Kegiatan: ${resultske[0].tanggal_kegiatan}`,
                          { align: "center" }
                        );
                      doc
                        .fontSize(15)
                        .text(`Waktu Mulai: ${resultske[0].waktu_mulai}`, {
                          align: "center",
                        });
                      doc
                        .fontSize(15)
                        .text(`Waktu Selesai: ${resultske[0].waktu_selesai}`, {
                          align: "center",
                        });
                      doc.moveDown(1);

                      // Menambahkan informasi peserta
                      doc
                        .fontSize(15)
                        .text(`Nama: ${siswaResult.nama_panitia}`, {
                          align: "center",
                        });

                      doc.end();
                      console.log(
                        `Generate stop ke-${index + 1} untuk ${
                          siswaResult.nama_panitia
                        }`
                      );
                      resolve({
                        success: true,
                        message: "PDF berhasil dihasilkan",
                      });
                    });
                  });
                  Promise.all(promises).then(() => {
                    resolve({
                      success: true,
                      message: "PDF berhasil dihasilkan",
                    });
                  });
                }
              });
            });
            resolve({ success: true, message: "PDF berhasil dihasilkan" });
            // Tambahkan resolve di sini
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async generatePdf(id) {
    try {
      const query = `
        SELECT judul_topik, tanggal_kegiatan, waktu_mulai, waktu_selesai 
        FROM kegiatan 
        WHERE id_kegiatan = ?
      `;
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [id], async (error, resultske, fields) => {
          if (error) {
            reject(error);
          } else {
            const querySiswa = `
              SELECT dp.*, dtp.duration, dtp.id_detail_peserta, dtp.id_kegiatan 
              FROM detail_peserta dtp 
              JOIN daftar_peserta dp 
              ON dtp.id_peserta = dp.id_peserta 
              WHERE dtp.id_kegiatan = ?
            `;
            const siswaResults = await new Promise((resolve, reject) => {
              pool.query(querySiswa, [id], (error, results, fields) => {
                if (error) {
                  reject(error);
                } else {
                  const promises = results.map((siswaResult, index) => {
                    return new Promise((resolve, reject) => {
                      const PDFDocument = require("pdfkit");
                      const fs = require("fs");
                      const doc = new PDFDocument({
                        margin: 50,
                        size: "A4",
                        layout: "landscape",
                      });

                      const filePath = `uploads/sertifikat/${resultske[0].judul_topik.replace(
                        / /g,
                        "_"
                      )}-${siswaResult.nama.replace(/ /g, "_")}.pdf`;
                      console.log(filePath);
                      console.log(
                        `Generate ke-${index + 1} untuk ${siswaResult.nama}`
                      );
                      if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                      }
                      doc.pipe(fs.createWriteStream(filePath));

                      // Menambahkan border double dan header
                      doc.rect(50, 50, 692, 500).lineWidth(1).stroke();
                      doc.rect(55, 55, 682, 490).lineWidth(1).stroke(); // Border dalam untuk efek double
                      doc.image("assets/logo.png", 356, 60, { width: 130 }); // Logo di tengah
                      doc.moveDown(8); // Menyesuaikan posisi turun lebih banyak
                      doc
                        .fontSize(25)
                        .text("Sertifikat Partisipasi", { align: "center" });
                      doc.moveDown(0.5);
                      doc
                        .fontSize(20)
                        .text(`Telah mengikuti webinar dengan topik:`, {
                          align: "center",
                        });
                      doc
                        .fontSize(25)
                        .text(resultske[0].judul_topik, { align: "center" });
                      doc.moveDown(0.5);

                      // Menambahkan detail kegiatan
                      doc
                        .fontSize(15)
                        .text(
                          `Tanggal Kegiatan: ${resultske[0].tanggal_kegiatan}`,
                          { align: "center" }
                        );
                      doc
                        .fontSize(15)
                        .text(`Waktu Mulai: ${resultske[0].waktu_mulai}`, {
                          align: "center",
                        });
                      doc
                        .fontSize(15)
                        .text(`Waktu Selesai: ${resultske[0].waktu_selesai}`, {
                          align: "center",
                        });
                      doc.moveDown(1);

                      // Menambahkan informasi peserta
                      doc
                        .fontSize(15)
                        .text(`Nama: ${siswaResult.nama}`, { align: "center" });
                      doc.fontSize(15).text(`Email: ${siswaResult.email}`, {
                        align: "center",
                      });

                      doc.end();
                      console.log(
                        `Generate stop ke-${index + 1} untuk ${
                          siswaResult.nama
                        }`
                      );
                      resolve({
                        success: true,
                        message: "PDF berhasil dihasilkan",
                      });
                    });
                  });
                  Promise.all(promises).then(() => {
                    resolve({
                      success: true,
                      message: "PDF berhasil dihasilkan",
                    });
                  });
                }
              });
            });
            resolve({ success: true, message: "PDF berhasil dihasilkan" });
            // Tambahkan resolve di sini
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async kirimEmailById(id) {
    try {
      const query = `
        SELECT judul_topik, tanggal_kegiatan, waktu_mulai, waktu_selesai 
        FROM kegiatan 
        WHERE id_kegiatan = ?
      `;
      const result = await new Promise((resolve, reject) => {
        pool.query(query, [id], async (error, resultske, fields) => {
          if (error) {
            reject(error);
          } else {
            const querySiswa = `
              SELECT dp.*, dtp.duration, dtp.id_detail_peserta, dtp.id_kegiatan 
              FROM detail_peserta dtp 
              JOIN daftar_peserta dp 
              ON dtp.id_peserta = dp.id_peserta 
              WHERE dtp.id_kegiatan = ?
            `;
            const siswaResults = await new Promise((resolve, reject) => {
              pool.query(querySiswa, [id], (error, results, fields) => {
                if (error) {
                  reject(error);
                } else {
                  const promises = results.reduce(
                    async (previousPromise, siswaResult, index) => {
                      await previousPromise;
                      return new Promise(async (resolve, reject) => {
                        const fs = require("fs");
                        const filePath = `uploads/sertifikat/${resultske[0].judul_topik.replace(
                          / /g,
                          "_"
                        )}-${siswaResult.nama.replace(/ /g, "_")}.pdf`;

                        if (fs.existsSync(filePath) && siswaResult.email) {
                          const nodemailer = require("nodemailer");
                          let transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                              user: "ifws.app@gmail.com",
                              pass: "rjlg smto cvjh nomu",
                            },
                          });

                          let mailOptions = {
                            from: "ifws.app@gmail.com",
                            to: siswaResult.email,
                            subject: `Sertifikat Kegiatan dengan Topik ${resultske[0].judul_topik}`,
                            text: "Berikut adalah sertifikat kegiatan Anda.",
                            attachments: [
                              {
                                filename: `${resultske[0].judul_topik.replace(
                                  / /g,
                                  "_"
                                )}-${siswaResult.nama.replace(/ /g, "_")}.pdf`,
                                path: filePath,
                              },
                            ],
                          };

                          transporter.sendMail(
                            mailOptions,
                            function (error, info) {
                              if (error) {
                                console.log("Error sending email: " + error);
                                reject({
                                  success: false,
                                  message: "Gagal mengirim email",
                                  error: error,
                                });
                              } else {
                                console.log("Email sent: " + info.response);
                                resolve({
                                  success: true,
                                  message: "Email berhasil dikirim",
                                });
                              }
                            }
                          );
                          console.log(filePath);
                          console.log(
                            `kirim ke-${index + 1} untuk ${siswaResult.nama}`
                          );
                        } else {
                          console.log(
                            `File tidak ada atau email tidak valid: ${filePath}`
                          );
                          resolve({
                            success: false,
                            message: "File tidak ada atau email tidak valid",
                          });
                        }

                        console.log(
                          `kirim email ke-${index + 1} untuk ${
                            siswaResult.email
                          }`
                        );
                      });
                    },
                    Promise.resolve()
                  );
                  promises
                    .then(() => {
                      resolve({
                        success: true,
                        message: "Semua email berhasil dikirim",
                      });
                    })
                    .catch((error) => {
                      reject({
                        success: false,
                        message: "Terjadi kesalahan saat mengirim email",
                        error: error,
                      });
                    });
                }
              });
            });
            resolve({ success: true, message: "Email berhasil dikirim" });
          }
        });
      });
      return result;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async updateKegiatan(
    id_kegiatan,
    judul_topik,
    link_webinar,
    tanggal_kegiatan,
    waktu_mulai,
    waktu_selesai,
    id_semester
  ) {
    try {
      const semesterQuery = `
        SELECT tanggal_awal, tanggal_akhir FROM semester WHERE id_semester = ?
      `;
      const semesterResult = await new Promise((resolve, reject) => {
        pool.query(
          semesterQuery,
          [id_semester],
          (searchError, searchResults) => {
            if (searchError) {
              reject(searchError);
            } else {
              resolve(searchResults);
            }
          }
        );
      });

      const tanggalAwal = moment
        .utc(semesterResult[0].tanggal_awal)
        .tz("Asia/Jakarta")
        .toDate();
      const tanggalAkhir = moment
        .utc(semesterResult[0].tanggal_akhir)
        .tz("Asia/Jakarta")
        .toDate();

      const tanggalKegiatan = moment
        .utc(tanggal_kegiatan)
        .tz("Asia/Jakarta")
        .toDate();
      if (tanggalKegiatan >= tanggalAwal && tanggalKegiatan <= tanggalAkhir) {
        const query =
          "UPDATE kegiatan SET judul_topik = ?, link_webinar = ?, tanggal_kegiatan = ?, waktu_mulai = ?, waktu_selesai = ?, id_semester = ? WHERE id_kegiatan = ?";
        const result = await pool.query(query, [
          judul_topik,
          link_webinar,
          tanggal_kegiatan,
          waktu_mulai,
          waktu_selesai,
          id_semester,
          id_kegiatan,
        ]);
        return { success: true, message: "Semester updated successfully" };
      } else {
        return {
          success: false,
          message: "Tanggal kegiatan tidak berada dalam rentang semester",
        };
      }
    } catch (error) {
      console.error("Error updating Kegiatan:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async deleteKegiatan(id) {
    try {
      const query = "DELETE FROM kegiatan WHERE id_kegiatan = ?";
      const result = await pool.query(query, [id]);
      return { success: true, message: "Semester deleted successfully" };
    } catch (error) {
      console.error("Error deleting Semester:", error);
      throw new Error("Database error: " + error.message);
    }
  }
}

module.exports = KegiatanModel;
