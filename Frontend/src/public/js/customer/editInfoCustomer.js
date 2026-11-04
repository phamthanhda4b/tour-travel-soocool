let buttonSaveInfo = document.querySelector('.button-save-info');
let inputUsername = document.querySelector('#username');
let inputPhoneNumber = document.querySelector('#phonenumber');
let inputEmail = document.querySelector('#email');
let inputAddress = document.querySelector('#address');

let validatedValue = () => {
  let check = true;
  let regex =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỂếỄỆỈỊỌỎỐỒỔỖỘỚờỞỡỡỤỦỨỪỬỮỰỲỴÝỶỸửữựỲỴÝỶỸ\s]*$/;
  if (inputUsername.value === '') {
    check = false;
    swal('Lỗi nhập dữ liệu!', 'Không được để trống tên', 'error');
  }
  if (!regex.test(inputUsername.value) && check) {
    check = false;
    swal(
      'Lỗi nhập dữ liệu!',
      'Tên không được chứa số, kí tự đặc biệt',
      'error'
    );
  }
  let regexNumber = /^[0-9]+$/;
  if (!regexNumber.test(inputPhoneNumber.value) && check) {
    check = false;
    swal('Lỗi nhập dữ liệu!', 'Số điện thoại chỉ chứa số', 'error');
  }
  let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regexEmail.test(inputEmail.value) && check) {
    check = false;
    swal('Lỗi nhập dữ liệu!', 'Email không hợp lệ', 'error');
  }
  if (inputAddress.value === '') {
    check = false;
    swal('Lỗi nhập dữ liệu!', 'Không được để trống địa chỉ', 'error');
  }
  return check;
};

let handleUpdateInfo = async () => {
  let userId = sessionStorage.getItem('userID');
  try {
    let res = await axios.put(`http://localhost:3124/api/v1/users/${userId}`, {
      email: inputEmail.value,
      phoneNumber: inputPhoneNumber.value,
      address: inputAddress.value,
      name: inputUsername.value,
    });
    swal('Thông báo', 'Lưu thay đổi thành công', 'success');
  } catch (error) {
    let errorMessage = error.response.data.message;
    swal('Lỗi!', errorMessage, 'error');
    return;
  }
};

buttonSaveInfo.addEventListener('click', async () => {
  let check = validatedValue();
  if (!check) return;
  await handleUpdateInfo();
});
