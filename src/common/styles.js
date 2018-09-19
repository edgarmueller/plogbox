import red from 'material-ui/colors/red';

export const button = {
  textDecoration: 'none',
  color: '#333435',
  paddingLeft: '1em',
  paddingRight: '1em',
  borderRadius: '28px',
  border: '2px solid #80CBC4',
  height: '24px',
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: '1em',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#80CBC4',
    color: '#fff',
  },
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.065em',
};

export const formButtonBar = {
  display: 'flex',
  marginTop: '1em',
};

export const appBar = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #ebebeb',
  width: '100%',
  borderBottomLeftRadius: '0.5em',
  borderBottomRightRadius: '0.5em',
};

export const card = {
  marginTop: '1em',
  color: '#6a6969',
  // use theme's spacing?
  padding: '8px',
  background: '#fff',
  borderRadius: '0.5em',
  fontSize: '0.85em',
};

export const header = {
  fontFamily: "'Montserrat', sans-serif",
  color: '#6a6969',
};

export const cardContent = {
  padding: '0',
};

export const errorStyle = {
  color: red[400],
  paddingTop: '1em',
};
