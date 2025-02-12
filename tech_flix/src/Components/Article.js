import React from 'react'
import { makeStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        backgroundColor: '#0c0e16',
        color: 'white', 
        maxWidth: '250px',
        borderRadius: 15,
        padding: '5px',
        opacity: '75%',
        // boxShadow: "5px 5px 5px 5px rgba(0, 0, 0, 0.3)",
        "&:hover": {
            transform: 'scale(1.07)',
            transition: 'transform .5s',
            opacity: '100%',
            backgroundColor: '#20263d'
        }
    },
    media: {
      height: '150px',
      width: '270px'
    },
    font: {
        fontFamily: 'Avenir-Light, Arial, Helvetica, sans-serif' 
    }
  });

function Article() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
        <CardActionArea>
            <CardMedia
            className={classes.media}
            image="https://www.fillmurray.com/270/120?random"
            />
            <CardContent className={classes.font}>
                <Typography variant="body" color="white" component="h2" style={{fontSize: '16px'}}>
                    Article Title
                </Typography>
                <Typography variant="body" color="white" component="p" style={{fontSize: '13px'}}>
                    This is a tech article about something very techie.
                </Typography>
            </CardContent>
        </CardActionArea>
        </Card>
    )
}

export default Article
