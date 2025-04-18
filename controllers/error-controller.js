exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
      pageTitle: 'Page Not Found',
      pageClass: 'error-page',
    });
  };
  
  exports.get500 = (err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).render('500', {
      pageTitle: 'Server Error',
      pageClass: 'error-page',
    });
  };
  