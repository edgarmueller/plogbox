import red from 'material-ui/colors/red';

export const center = {
  position: 'relative',
  top: '50%',
  left: '50%'
};

export const button = {
  textDecoration: 'none',
  color: '#333435',
  paddingLeft: '1em',
  paddingRight: '1em',
  borderRadius: '28px',
  border: '2px solid #90a2eb',
  height: '24px',
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: '1em',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#90a2eb',
    color: '#fff',
  },
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.065em',
};

export const link = {
  textDecoration: 'none',
  color: '#333435',
  paddingLeft: '2em',
  paddingRight: '2em',
  borderRadius: '28px',
  border: '2px solid #90a2eb',
  height: '28px',
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: '1em',
  marginRight: '1em',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#90a2eb',
    color: '#fff',
  },
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.065em',
}

export const formButtonBar = {
  display: 'flex',
  marginTop: '1em',
};

export const appBar = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #ebebeb',
  width: '80%',
  margin: 'auto',
  borderBottomLeftRadius: '0.5em',
  borderBottomRightRadius: '0.5em',
};

export const card = {
  color: '#6a6969',
  // use theme's spacing?
  padding: '8px',
  background: '#fff',
  // borderRadius: '0.5em',
  fontSize: '0.85em',
  margin: 'auto',
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

export const inProgressStyle = {
  color: 'blue',
  paddingTop: '1em',
};

export const successStyle = {
  color: 'green',
  paddingTop: '1em',
};
