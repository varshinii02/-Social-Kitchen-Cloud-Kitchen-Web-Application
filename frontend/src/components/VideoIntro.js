import React from 'react';
import { Container } from 'react-bootstrap';
import './VideoIntro.css';

export default function VideoIntro() {
  return (
    <div className='video-header'>
      <video src='./images/video2.mp4' autoPlay muted></video>
      <div className="viewport-header">
        <Container>
          <div className="row no-gutters">
            <div className="col">
              <div className="mainHeading">
                <p>DELICIOUSLY MADE</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
