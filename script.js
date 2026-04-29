function scrollToForm() {
  document.getElementById("form").scrollIntoView({ behavior: "smooth" });
}

function submitForm() {
  let name = document.getElementById("name").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;

  if (!name || !phone || !email) {
    document.getElementById("message").innerText = "Vui lòng nhập đủ thông tin";
    return;
  }

  document.getElementById("message").innerText = "Đăng ký thành công!";
}
