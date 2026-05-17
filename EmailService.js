// Adding timeout handling

class EmailService {
    sendEmail(email) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Email service timeout'));
            }, 5000); // 5 seconds timeout

            // Simulated email sending logic
            this.simulateEmailSending(email)
                .then(result => {
                    clearTimeout(timeout);
                    resolve(result);
                })
                .catch(err => {
                    clearTimeout(timeout);
                    reject(err);
                });
        });
    }

    simulateEmailSending(email) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(`Email sent to ${email}`), 2000); // Simulate 2 seconds delay
        });
    }
}