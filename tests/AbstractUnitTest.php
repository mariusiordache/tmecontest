<?php

abstract class AbstractUnitTest extends PHPUnit_Framework_TestCase {

    public function tearDown() {

        $result = $this->getTestResultObject();
        foreach ($result->failures() as $test) {
            $failures[] = $test->toString();
        }

        if (!empty($failures)) {
            // do something with tests that failed, like send an email
            $mail = new PHPMailer();
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'smtp.gmail.com';                       // Specify main and backup server
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'timmy@mariusiordache.com';
            $mail->Password = 'gatacujoaca';                       
            $mail->SMTPSecure = 'tls';                            // Enable encryption, 'ssl' also accepted

            $mail->From = 'timmy@mariusiordache.com';
            $mail->FromName = 'PHP Unit';
            $mail->addAddress('contact@mariusiordache.com');  // Add a recipient
            $mail->addAddress('matei@timmystudios.com');  // Add a recipient
            $mail->addReplyTo('contact@mariusiordache.com');

            $mail->WordWrap = 50;                                 // Set word wrap to 50 characters

            $mail->Subject = get_called_class() . " failed " . count($failures) . " times";
            $mail->Body = implode("\n", $failures);

            $mail->send();
        }
    }

}
