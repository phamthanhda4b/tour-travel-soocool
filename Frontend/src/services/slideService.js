const db = require('../models');
const fs = require('fs');
const path = require('path');

const getAllSlides = async () => {
  try {
    const slides = await db.Slide.findAll({
      order: [
        ['order_index', 'ASC'],
        ['id', 'DESC'],
      ],
    });
    return {
      errCode: 0,
      message: 'OK',
      data: slides,
    };
  } catch (error) {
    console.error('Error getAllSlides:', error);
    return {
      errCode: 1,
      message: 'Lỗi truy vấn danh sách slide',
    };
  }
};

const getActiveSlides = async () => {
  try {
    const slides = await db.Slide.findAll({
      where: { status: 1 },
      order: [
        ['order_index', 'ASC'],
        ['id', 'ASC'],
      ],
    });
    return {
      errCode: 0,
      message: 'OK',
      data: slides,
    };
  } catch (error) {
    console.error('Error getActiveSlides:', error);
    return {
      errCode: 1,
      message: 'Lỗi truy vấn slide hoạt động',
    };
  }
};

const getSlideById = async (id) => {
  try {
    const slide = await db.Slide.findByPk(id);
    if (!slide) {
      return {
        errCode: 2,
        message: 'Slide không tồn tại',
      };
    }
    return {
      errCode: 0,
      message: 'OK',
      data: slide,
    };
  } catch (error) {
    console.error('Error getSlideById:', error);
    return {
      errCode: 1,
      message: 'Lỗi truy vấn thông tin slide',
    };
  }
};

const createSlide = async (data) => {
  try {
    if (!data.image_url) {
      return {
        errCode: 2,
        message: 'Vui lòng cung cấp hình ảnh cho slide',
      };
    }

    const newSlide = await db.Slide.create({
      title: data.title || '',
      description: data.description || '',
      image_url: data.image_url,
      link_url: data.link_url || '',
      order_index: data.order_index ? parseInt(data.order_index) : 0,
      status: data.status !== undefined ? parseInt(data.status) : 1,
    });

    return {
      errCode: 0,
      message: 'Thêm slide thành công',
      data: newSlide,
    };
  } catch (error) {
    console.error('Error createSlide:', error);
    return {
      errCode: 1,
      message: 'Lỗi khi tạo mới slide',
    };
  }
};

const updateSlide = async (id, data) => {
  try {
    const slide = await db.Slide.findByPk(id);
    if (!slide) {
      return {
        errCode: 2,
        message: 'Slide không tồn tại',
      };
    }

    // Nếu thay đổi ảnh và ảnh cũ là file cục bộ, có thể xóa file cũ
    if (data.image_url && data.image_url !== slide.image_url) {
      if (slide.image_url && slide.image_url.startsWith('/uploads/slides/')) {
        const oldFilePath = path.join(__dirname, '../public', slide.image_url);
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath);
          } catch (e) {
            console.warn('Không thể xóa file ảnh cũ:', e);
          }
        }
      }
    }

    slide.title = data.title !== undefined ? data.title : slide.title;
    slide.description = data.description !== undefined ? data.description : slide.description;
    if (data.image_url) {
      slide.image_url = data.image_url;
    }
    slide.link_url = data.link_url !== undefined ? data.link_url : slide.link_url;
    slide.order_index = data.order_index !== undefined ? parseInt(data.order_index) : slide.order_index;
    slide.status = data.status !== undefined ? parseInt(data.status) : slide.status;

    await slide.save();

    return {
      errCode: 0,
      message: 'Cập nhật slide thành công',
      data: slide,
    };
  } catch (error) {
    console.error('Error updateSlide:', error);
    return {
      errCode: 1,
      message: 'Lỗi khi cập nhật slide',
    };
  }
};

const deleteSlide = async (id) => {
  try {
    const slide = await db.Slide.findByPk(id);
    if (!slide) {
      return {
        errCode: 2,
        message: 'Slide không tồn tại',
      };
    }

    // Nếu ảnh là file cục bộ, xóa file khỏi đĩa
    if (slide.image_url && slide.image_url.startsWith('/uploads/slides/')) {
      const filePath = path.join(__dirname, '../public', slide.image_url);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn('Không thể xóa file ảnh:', e);
        }
      }
    }

    await slide.destroy();

    return {
      errCode: 0,
      message: 'Xóa slide thành công',
    };
  } catch (error) {
    console.error('Error deleteSlide:', error);
    return {
      errCode: 1,
      message: 'Lỗi khi xóa slide',
    };
  }
};

const toggleSlideStatus = async (id) => {
  try {
    const slide = await db.Slide.findByPk(id);
    if (!slide) {
      return {
        errCode: 2,
        message: 'Slide không tồn tại',
      };
    }

    slide.status = slide.status === 1 ? 0 : 1;
    await slide.save();

    return {
      errCode: 0,
      message: 'Cập nhật trạng thái thành công',
      data: slide,
    };
  } catch (error) {
    console.error('Error toggleSlideStatus:', error);
    return {
      errCode: 1,
      message: 'Lỗi khi đổi trạng thái slide',
    };
  }
};

module.exports = {
  getAllSlides,
  getActiveSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  toggleSlideStatus,
};
