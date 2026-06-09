import React, { useState, useEffect } from 'react'
import { Accordion, Card, Button, CardGroup } from 'react-bootstrap';

export default function AboutScreen() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq');
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    fetchFAQs();
  }, []);

  return (
    <>
      {/* Header Card */}
      <Card className="bg-dark text-white">
        <Card.Img src="./images/aboutImage.jpg" alt="Card image" style={{ opacity: "0.5" }} />
        <Card.ImgOverlay>
          <Card.Title style={{ fontSize: "50px" }}>About us</Card.Title>
          <Card.Text style={{ fontSize: "25px" }}>
          At DeliciouslyMade, we’re passionate about serving homemade meals that are fresh, healthy, and full of flavor.

Our mission is simple: bring the warmth of a home-cooked dish to your doorstep, made with love and natural ingredients.

We believe good food fuels a good life — and we’re here to make that deliciously simple for you.
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>
           
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>
            We are passionate about delivering wholesome food and a rejuvenating experience to your doorstep.
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>
            Freshness, Nutrition, and Purity are to name a few of the Values to be associated with food. Our topmost priority is to deliver these values to your doorstep.
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>
            Our Mission is to help people learn more about food, eating habits, and ways to stay healthy (not just physically but also spiritually) and ultimately get Joy out of this beautiful blessing called LIFE.
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>
            Natural ingredients: We use the absolute best ingredients money can buy and EVERYTHING we do is about flavor, quality, and taste that consumers love.
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>
            We understand your need to stay fit and eat healthily and hence we are here with dishes that will not only help you stay fit but are tasty as well.
          </Card.Text>
          <Card.Text style={{ fontSize: "25px" }}>Live your best life with Social Kitchen</Card.Text>
        </Card.ImgOverlay>
      </Card>

      {/* Testimonials Section */}
      <div className='review' style={{ margin: "20px 30px" }}>
        <h4 style={{ textAlign: "center" }}> Testimonials</h4>
        <CardGroup style={{ margin: "20px 30px" }}>
          {/* Testimonial 1 */}
          <Card>
            <Card.Img variant="top" src="./images/image1.png" height={"165px"} />
            <Card.Body>
              <Card.Title>Varsha P H</Card.Title>
              <Card.Text>(Student, JSSATEBy)</Card.Text>
              <Card.Text>
                The people that work here are so nice! The delivery is seriously so awesome.{' '}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <p className="pstart">Rating: <span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="w-star">★</span></p>
            </Card.Footer>
          </Card>
          {/* Testimonial 2 */}
          <Card>
            <Card.Img variant="top" src="./images/varshini.jpg" height={"165px"} />
            <Card.Body>
              <Card.Title>V K Sri Varshini </Card.Title>
              <Card.Text>(Student, JSSATEB)</Card.Text>
              <Card.Text>
              I've had an amazing experience at this kiitchen! The food is consistently delicious, and the service is exceptional. I highly recommend trying our signature dishes!{' '}
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <p className="pstart">Rating: <span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span></p>
            </Card.Footer>
          </Card>
          {/* Testimonial 3 */}
          <Card>
            <Card.Img variant="top" src="./images/hr4.jpeg" height={"165px"} />
            <Card.Body>
              <Card.Title>A S Sanjana</Card.Title>
              <Card.Text>(Student, JSSATEB)</Card.Text>
              <Card.Text>
                Hands down best loaded fries I've had in a while. If you're looking for good food and , don't forget to stop here..
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <p className="pstart">Rating: <span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span></p>
            </Card.Footer>
          </Card>
          {/* Testimonial 4 */}
          <Card>
            <Card.Img variant="top" src="./images/rukmini.jpg" height={"165px"} />
            <Card.Body>
              <Card.Title>Rukmini G</Card.Title>
              <Card.Text>(Student, JSSATEB)</Card.Text>
              <Card.Text>
             I've had an amazing experience at this kiitchen! The food is consistently delicious, and the service is exceptional. I highly recommend trying our signature dishes!
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <p className="pstart">Rating: <span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span><span className="red-star">★</span></p>
            </Card.Footer>
          </Card>
        </CardGroup>
      </div>

      {/* Accordion Section */}
      <div style={{ margin: "20px 30px" }}>
        <h4 style={{ textAlign: "center" }}>FAQ</h4>
        <Accordion defaultActiveKey="0">
          {/* Accordion Item 1 */}
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                What are the benefits of ordering from Social Kitchen?
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                Our food is made from fresh, locally sourced ingredients and delivered straight to your door.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          {/* Accordion Item 2 */}
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Do you offer custom meals?
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                Yes! We offer a range of custom meal options to suit your dietary preferences.
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          {/* Accordion Item 3 */}
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
                How do I place an order?
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                You can easily place an order through our website or mobile app. Just choose your meal, add it to the cart, and proceed with checkout!
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          {/* Dynamic FAQ Items from MongoDB */}
          {faqs.map((faq, index) => (
            <Card key={faq._id}>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey={`${index + 3}`}>
                  {faq.comment}
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={`${index + 3}`}>
                <Card.Body>
                  {faq.answer ? faq.answer : 'No answer yet.'}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      </div>
    </>
  )
}
