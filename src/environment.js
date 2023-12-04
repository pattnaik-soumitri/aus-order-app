export const isEmulating = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ?
  true : false;

export const isProductionEnv = () => {
  switch (window.location.hostname.toLowerCase()) {
  	case 'aus-order-form.web.app':
  	case 'aus-order-form.firebaseapp.com':
  	  return true;
  }
  return false;
};
