export const updateMatchingPool = (teacherId, status) => {
    if (status === 'online') {
        console.log(`Teacher ${teacherId} added to active matching pool.`);
        // Yahan aap Redis ya Global Array mein push karne ka logic likh sakte hain
    } else {
        console.log(`Teacher ${teacherId} removed from active matching pool.`);
        // Busy ya offline hone par pool se nikal dein
    }
};