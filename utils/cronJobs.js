import cron from 'node-cron';
import TeacherStatus from '../model/teacherStatus.model.js';

// Har 15 minute mein check karega ki koi teacher inactive toh nahi hai
export const initCronJobs = () => {
    cron.schedule('*/15 * * * *', async () => {
        console.log('Running Auto-Offline Check...');
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        // Agar 1 ghante se koi activity nahi hui toh offline kar do
        await TeacherStatus.updateMany(
            { lastActive: { $lt: oneHourAgo }, status: { $ne: 'offline' } },
            { status: 'offline', updatedBy: 'system' }
        );
    });
};