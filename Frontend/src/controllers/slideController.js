const slideService = require('../services/slideService');

// --- Render Admin Views ---
const slidePage = async (req, res) => {
  try {
    const result = await slideService.getAllSlides();
    return res.render('admin/slide.ejs', {
      slides: result.data || [],
    });
  } catch (error) {
    console.error('Error slidePage:', error);
    return res.render('admin/slide.ejs', { slides: [] });
  }
};

const slideAddPage = async (req, res) => {
  return res.render('admin/slideAdd.ejs');
};

const slideModifyPage = async (req, res) => {
  try {
    const slideId = req.params.id;
    const result = await slideService.getSlideById(slideId);
    if (result.errCode !== 0) {
      return res.redirect('/admin/slides');
    }
    return res.render('admin/slideModify.ejs', {
      slide: result.data,
    });
  } catch (error) {
    console.error('Error slideModifyPage:', error);
    return res.redirect('/admin/slides');
  }
};

// --- API Handlers ---
const handleGetActiveSlides = async (req, res) => {
  try {
    const result = await slideService.getActiveSlides();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleGetActiveSlides:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

const handleGetAllSlides = async (req, res) => {
  try {
    const result = await slideService.getAllSlides();
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleGetAllSlides:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

const handleGetSlideById = async (req, res) => {
  try {
    const slideId = req.params.id;
    const result = await slideService.getSlideById(slideId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleGetSlideById:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

const handleCreateSlide = async (req, res) => {
  try {
    let imageUrl = '';

    // Nếu tải ảnh từ máy tính (qua multer)
    if (req.file) {
      imageUrl = `/uploads/slides/${req.file.filename}`;
    } else if (req.body.image_url && req.body.image_url.trim() !== '') {
      // Nếu nhập bằng link
      imageUrl = req.body.image_url.trim();
    }

    if (!imageUrl) {
      return res.status(400).json({
        errCode: 2,
        message: 'Vui lòng cung cấp link ảnh hoặc tải ảnh từ máy tính',
      });
    }

    const data = {
      title: req.body.title,
      description: req.body.description,
      image_url: imageUrl,
      link_url: req.body.link_url,
      order_index: req.body.order_index,
      status: req.body.status !== undefined ? req.body.status : 1,
    };

    const result = await slideService.createSlide(data);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleCreateSlide:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

const handleUpdateSlide = async (req, res) => {
  try {
    const slideId = req.params.id;
    let imageUrl = undefined;

    // Nếu tải ảnh mới từ máy tính
    if (req.file) {
      imageUrl = `/uploads/slides/${req.file.filename}`;
    } else if (req.body.image_url && req.body.image_url.trim() !== '') {
      // Nếu nhập link ảnh mới
      imageUrl = req.body.image_url.trim();
    }

    const data = {
      title: req.body.title,
      description: req.body.description,
      link_url: req.body.link_url,
      order_index: req.body.order_index,
      status: req.body.status,
    };

    if (imageUrl) {
      data.image_url = imageUrl;
    }

    const result = await slideService.updateSlide(slideId, data);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleUpdateSlide:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

const handleDeleteSlide = async (req, res) => {
  try {
    const slideId = req.params.id;
    const result = await slideService.deleteSlide(slideId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleDeleteSlide:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

const handleToggleStatus = async (req, res) => {
  try {
    const slideId = req.params.id;
    const result = await slideService.toggleSlideStatus(slideId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handleToggleStatus:', error);
    return res.status(500).json({ errCode: 1, message: 'Lỗi server' });
  }
};

module.exports = {
  slidePage,
  slideAddPage,
  slideModifyPage,
  handleGetActiveSlides,
  handleGetAllSlides,
  handleGetSlideById,
  handleCreateSlide,
  handleUpdateSlide,
  handleDeleteSlide,
  handleToggleStatus,
};
