import axios from "axios";
import { Formik } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ChangePassword = () => {
  const handleSubmit = async (values) => {
    console.log("Form values:", values);
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("authToken");

    if (values.password_new !== values.password_new_confirm) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (values.password_old === values.password_new) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu cũ!");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/public/users/${encodeURIComponent(email)}/changePassword`,
        null,
        {
          params: { newPassword: values.password_new },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Đổi mật khẩu thành công!");
      Swal.fire("Thành công!", "Mật khẩu đã được thay đổi.", "success");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại!");
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="container-fluid px-4">
      <div className="row">
        <main className="col-12 mx-auto">
          <div className="card shadow p-4">
            <h4 className="mb-4">Đổi mật khẩu</h4>
            <Formik
              initialValues={{
                password_old: "",
                password_new: "",
                password_new_confirm: "",
              }}
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="password_old" className="form-label">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_old"
                      name="password_old"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={values.password_old}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password_new" className="form-label">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_new"
                      name="password_new"
                      placeholder="Nhập mật khẩu mới"
                      value={values.password_new}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password_new_confirm" className="form-label">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_new_confirm"
                      name="password_new_confirm"
                      placeholder="Nhập lại mật khẩu mới"
                      value={values.password_new_confirm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>

                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={isSubmitting}
                    >
                      Xác nhận
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChangePassword;
