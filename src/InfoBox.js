import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './InfoBox.css';

function InfoBox({ title, cases, total, isRed, active, ...props }) {
  return (
    <Card
      className={`infoBox ${active && "infoBox_selected"} ${isRed && 'infoBox_red'}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography color='textSecondary' className='infoBox_title'>
          {title}
        </Typography>
        <h2 className={`infoBox_cases ${!isRed && 'infoBox_green'}`}>{cases}</h2>
        <Typography color='textSecondary' className='infoBox_total'>
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
