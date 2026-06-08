<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users (exact data including hashed passwords)
        DB::table('users')->insert([
            ['id'=>1,  'name'=>'Abdelrahman Emad',  'email'=>'Abdelrahman@gmail.com',       'email_verified_at'=>null, 'password'=>'$2y$12$mfSDWpA5cyFO/xJ6nZfa4ehqv6xxQHN9tdj/h0DDf2Yz9Gz1PhRhq', 'remember_token'=>null, 'created_at'=>'2026-06-07 17:32:10', 'updated_at'=>'2026-06-07 17:32:10', 'role'=>'learner', 'phone'=>'01000220869',  'gender'=>'male',   'date_of_birth'=>'2002-12-31'],
            ['id'=>2,  'name'=>'Ahmed yehia',        'email'=>'ahmedheyia@gmail.com',        'email_verified_at'=>null, 'password'=>'$2y$12$L0M34mU/oAXUJbhhMyKFHuV4OzxXaQqW.HOD2popxIEiCxsQ1BrQ6', 'remember_token'=>null, 'created_at'=>'2026-06-07 17:33:32', 'updated_at'=>'2026-06-07 17:33:32', 'role'=>'learner', 'phone'=>'01232208691',  'gender'=>'male',   'date_of_birth'=>'2026-06-04'],
            ['id'=>3,  'name'=>'Ahmed yehia',        'email'=>'ahmedheyia1@gmail.com',       'email_verified_at'=>null, 'password'=>'$2y$12$Zbv4Dc4i60HFR9kHwG30peS0Ikkh/b6UZFi8KgHZiW4QX.k3z8qR2', 'remember_token'=>null, 'created_at'=>'2026-06-07 17:36:40', 'updated_at'=>'2026-06-07 17:36:40', 'role'=>'learner', 'phone'=>'01232208692',  'gender'=>'male',   'date_of_birth'=>'2026-06-04'],
            ['id'=>4,  'name'=>'Ahmed Hassan',       'email'=>'teacher@learnxchange.com',    'email_verified_at'=>null, 'password'=>'$2y$12$jnPn.ViPzX6mW4iqhHBb7eAMZlkzoDldorKYDOcs.3QsLGdNjGDDW', 'remember_token'=>null, 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38', 'role'=>'teacher', 'phone'=>'01100000001',  'gender'=>'male',   'date_of_birth'=>'1990-05-15'],
            ['id'=>5,  'name'=>'Admin',              'email'=>'admin@learnxchange.com',      'email_verified_at'=>null, 'password'=>'$2y$12$TLGtk9mBWfBqbtzraVMq5e4uXGlNDtz62YxYrmtjUsNLSgV7tqMqe', 'remember_token'=>null, 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38', 'role'=>'admin',   'phone'=>'01100000002',  'gender'=>'male',   'date_of_birth'=>'1985-01-01'],
            ['id'=>6,  'name'=>'Sara Exchange',      'email'=>'exchange@learnxchange.com',   'email_verified_at'=>null, 'password'=>'$2y$12$UJg8G.svcBk1s.UaaK2g8ueI49LqI/34htmhDT3OM9GIbRCBIQFya', 'remember_token'=>null, 'created_at'=>'2026-06-07 18:53:18', 'updated_at'=>'2026-06-07 18:53:18', 'role'=>'both',    'phone'=>'01100000003',  'gender'=>'female', 'date_of_birth'=>'1995-03-20'],
            ['id'=>8,  'name'=>'Ali Programmer',     'email'=>'ali@test.com',                'email_verified_at'=>null, 'password'=>'$2y$12$MuA56VeqZDS7HxdTC0t/QOtJJpA8GMTwxWBGma9hSJ1KKalSCTarO', 'remember_token'=>null, 'created_at'=>'2026-06-07 22:42:46', 'updated_at'=>'2026-06-07 22:42:46', 'role'=>'learner', 'phone'=>'01200000001',  'gender'=>'male',   'date_of_birth'=>'2026-06-10'],
            ['id'=>9,  'name'=>'Sara Designer',      'email'=>'sara@test.com',               'email_verified_at'=>null, 'password'=>'$2y$12$4XPHeVX4rXDRi6HJlUAIGujRp8ceRFyhtTEqyrwlZRfp5GKg1k3Oy', 'remember_token'=>null, 'created_at'=>'2026-06-07 22:43:53', 'updated_at'=>'2026-06-07 22:43:53', 'role'=>'learner', 'phone'=>'01200000002',  'gender'=>'female', 'date_of_birth'=>'2026-06-09'],
            ['id'=>10, 'name'=>'essam marketing',    'email'=>'essam@test.com',              'email_verified_at'=>null, 'password'=>'$2y$12$JCSopSgbaxkiCduhbSugreMnEOm1gVWA2VFnYYDuXumN3FODB1JF2', 'remember_token'=>null, 'created_at'=>'2026-06-07 22:54:19', 'updated_at'=>'2026-06-07 22:54:19', 'role'=>'learner', 'phone'=>'01200000003',  'gender'=>'male',   'date_of_birth'=>'2026-06-09'],
            ['id'=>11, 'name'=>'basmalla front',     'email'=>'basmalla@test.com',           'email_verified_at'=>null, 'password'=>'$2y$12$cHM8HvWhdxBOxJ0ex2NGyums1ZTpDRk.hpCBoGOxMOBevVd5NnwXK', 'remember_token'=>null, 'created_at'=>'2026-06-07 22:56:07', 'updated_at'=>'2026-06-07 22:56:07', 'role'=>'learner', 'phone'=>'01200000004',  'gender'=>'female', 'date_of_birth'=>'2026-06-25'],
        ]);

        // Courses
        DB::table('courses')->insert([
            ['id'=>1,  'teacher_id'=>4, 'title'=>'Complete Python Bootcamp',               'category'=>'Programming',  'description'=>'Learn Python from scratch. Covers basics, OOP, file handling, APIs, and data science foundations. Perfect for absolute beginners.', 'price'=>0,   'capacity'=>50, 'duration'=>'8 weeks',  'created_date'=>'2026-05-01', 'ended_date'=>'2026-06-30', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>2,  'teacher_id'=>4, 'title'=>'Web Development with React & Next.js',  'category'=>'Programming',  'description'=>'Master modern frontend development using React 18 and Next.js 14. Build real-world projects with TypeScript and Tailwind CSS.',    'price'=>299, 'capacity'=>30, 'duration'=>'10 weeks', 'created_date'=>'2026-05-10', 'ended_date'=>'2026-07-20', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>3,  'teacher_id'=>4, 'title'=>'UI/UX Design Fundamentals',             'category'=>'Design',       'description'=>'Learn design thinking, wireframing, prototyping in Figma, and usability principles. Create stunning user interfaces from scratch.',  'price'=>199, 'capacity'=>25, 'duration'=>'6 weeks',  'created_date'=>'2026-05-15', 'ended_date'=>'2026-06-25', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>4,  'teacher_id'=>4, 'title'=>'Digital Marketing Mastery',             'category'=>'Marketing',    'description'=>'SEO, social media marketing, email campaigns, Google Ads, and analytics. Grow any business online with proven strategies.',          'price'=>149, 'capacity'=>40, 'duration'=>'5 weeks',  'created_date'=>'2026-05-20', 'ended_date'=>'2026-06-24', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>5,  'teacher_id'=>4, 'title'=>'Arabic Language for Beginners',         'category'=>'Languages',    'description'=>'Start speaking Arabic from day one. Covers Modern Standard Arabic (MSA) and conversational Egyptian dialect with native speaker recordings.', 'price'=>0,   'capacity'=>60, 'duration'=>'12 weeks', 'created_date'=>'2026-06-01', 'ended_date'=>'2026-08-24', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>6,  'teacher_id'=>4, 'title'=>'Data Science with Python & Pandas',     'category'=>'Data Science', 'description'=>'Analyze real datasets using Python, Pandas, NumPy, Matplotlib and Seaborn. Includes 5 hands-on projects with real-world data.',       'price'=>349, 'capacity'=>20, 'duration'=>'8 weeks',  'created_date'=>'2026-05-25', 'ended_date'=>'2026-07-20', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>7,  'teacher_id'=>4, 'title'=>'Photography: From Auto to Manual',      'category'=>'Photography',  'description'=>'Master your DSLR or mirrorless camera. Learn composition, lighting, exposure triangle, portrait and landscape photography.',          'price'=>99,  'capacity'=>30, 'duration'=>'4 weeks',  'created_date'=>'2026-06-01', 'ended_date'=>'2026-06-29', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>8,  'teacher_id'=>4, 'title'=>'English Speaking & Pronunciation',      'category'=>'Languages',    'description'=>'Improve your English fluency, reduce your accent and gain confidence in professional and casual conversations.',                      'price'=>0,   'capacity'=>50, 'duration'=>'6 weeks',  'created_date'=>'2026-06-05', 'ended_date'=>'2026-07-17', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>9,  'teacher_id'=>4, 'title'=>'Machine Learning A-Z',                  'category'=>'Data Science', 'description'=>'Supervised and unsupervised learning, neural networks, and model evaluation. Hands-on with scikit-learn and TensorFlow.',             'price'=>499, 'capacity'=>15, 'duration'=>'14 weeks', 'created_date'=>'2026-05-01', 'ended_date'=>'2026-08-07', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
            ['id'=>10, 'teacher_id'=>4, 'title'=>'Graphic Design with Adobe Illustrator', 'category'=>'Design',       'description'=>'Learn vector design, logo creation, brand identity, and print design. Build a professional design portfolio by the end.',              'price'=>179, 'capacity'=>25, 'duration'=>'7 weeks',  'created_date'=>'2026-05-18', 'ended_date'=>'2026-07-06', 'created_at'=>'2026-06-07 17:38:38', 'updated_at'=>'2026-06-07 17:38:38'],
        ]);

        // Skills
        DB::table('skills')->insert([
            ['id'=>1,  'name'=>'Python',          'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>2,  'name'=>'JavaScript',      'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>3,  'name'=>'UI/UX Design',    'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>4,  'name'=>'English',         'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>5,  'name'=>'Arabic',          'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>6,  'name'=>'Data Science',    'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>7,  'name'=>'Photoshop',       'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>8,  'name'=>'Graphic Design',  'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>9,  'name'=>'Excel',           'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>10, 'name'=>'Machine Learning','created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>11, 'name'=>'React',           'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>12, 'name'=>'Figma',           'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>13, 'name'=>'Statistics',      'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>14, 'name'=>'Marketing',       'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>15, 'name'=>'Photography',     'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
        ]);

        // User Skills
        DB::table('user_skills')->insert([
            ['id'=>1,  'user_id'=>2,  'skill_id'=>1,  'type'=>'teach', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>2,  'user_id'=>2,  'skill_id'=>3,  'type'=>'learn', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>3,  'user_id'=>4,  'skill_id'=>3,  'type'=>'teach', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>4,  'user_id'=>4,  'skill_id'=>4,  'type'=>'teach', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>5,  'user_id'=>4,  'skill_id'=>1,  'type'=>'learn', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>6,  'user_id'=>4,  'skill_id'=>9,  'type'=>'learn', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>7,  'user_id'=>6,  'skill_id'=>4,  'type'=>'teach', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>8,  'user_id'=>6,  'skill_id'=>8,  'type'=>'teach', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>9,  'user_id'=>6,  'skill_id'=>1,  'type'=>'learn', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>10, 'user_id'=>6,  'skill_id'=>3,  'type'=>'learn', 'created_at'=>'2026-06-07 21:25:48', 'updated_at'=>'2026-06-07 21:25:48'],
            ['id'=>19, 'user_id'=>6,  'skill_id'=>9,  'type'=>'learn', 'created_at'=>'2026-06-07 22:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>20, 'user_id'=>6,  'skill_id'=>14, 'type'=>'teach', 'created_at'=>'2026-06-07 22:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>21, 'user_id'=>3,  'skill_id'=>12, 'type'=>'teach', 'created_at'=>'2026-06-07 22:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>22, 'user_id'=>3,  'skill_id'=>1,  'type'=>'learn', 'created_at'=>'2026-06-07 22:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>23, 'user_id'=>8,  'skill_id'=>1,  'type'=>'teach', 'created_at'=>'2026-06-07 22:44:26', 'updated_at'=>'2026-06-07 22:44:26'],
            ['id'=>24, 'user_id'=>8,  'skill_id'=>2,  'type'=>'teach', 'created_at'=>'2026-06-07 22:44:26', 'updated_at'=>'2026-06-07 22:44:26'],
            ['id'=>25, 'user_id'=>8,  'skill_id'=>12, 'type'=>'learn', 'created_at'=>'2026-06-07 22:44:36', 'updated_at'=>'2026-06-07 22:44:36'],
            ['id'=>26, 'user_id'=>8,  'skill_id'=>8,  'type'=>'learn', 'created_at'=>'2026-06-07 22:44:36', 'updated_at'=>'2026-06-07 22:44:36'],
            ['id'=>27, 'user_id'=>9,  'skill_id'=>12, 'type'=>'teach', 'created_at'=>'2026-06-07 22:45:51', 'updated_at'=>'2026-06-07 22:45:51'],
            ['id'=>28, 'user_id'=>9,  'skill_id'=>8,  'type'=>'teach', 'created_at'=>'2026-06-07 22:45:51', 'updated_at'=>'2026-06-07 22:45:51'],
            ['id'=>29, 'user_id'=>9,  'skill_id'=>2,  'type'=>'learn', 'created_at'=>'2026-06-07 22:45:56', 'updated_at'=>'2026-06-07 22:45:56'],
            ['id'=>30, 'user_id'=>9,  'skill_id'=>1,  'type'=>'learn', 'created_at'=>'2026-06-07 22:45:56', 'updated_at'=>'2026-06-07 22:45:56'],
            ['id'=>31, 'user_id'=>10, 'skill_id'=>13, 'type'=>'teach', 'created_at'=>'2026-06-07 22:54:47', 'updated_at'=>'2026-06-07 22:54:47'],
            ['id'=>32, 'user_id'=>10, 'skill_id'=>9,  'type'=>'teach', 'created_at'=>'2026-06-07 22:54:47', 'updated_at'=>'2026-06-07 22:54:47'],
            ['id'=>33, 'user_id'=>10, 'skill_id'=>4,  'type'=>'teach', 'created_at'=>'2026-06-07 22:54:47', 'updated_at'=>'2026-06-07 22:54:47'],
            ['id'=>34, 'user_id'=>10, 'skill_id'=>11, 'type'=>'learn', 'created_at'=>'2026-06-07 22:55:03', 'updated_at'=>'2026-06-07 22:55:03'],
            ['id'=>35, 'user_id'=>11, 'skill_id'=>11, 'type'=>'teach', 'created_at'=>'2026-06-07 22:56:25', 'updated_at'=>'2026-06-07 22:56:25'],
            ['id'=>36, 'user_id'=>11, 'skill_id'=>14, 'type'=>'learn', 'created_at'=>'2026-06-07 22:56:30', 'updated_at'=>'2026-06-07 22:56:30'],
            ['id'=>37, 'user_id'=>11, 'skill_id'=>13, 'type'=>'learn', 'created_at'=>'2026-06-07 22:59:28', 'updated_at'=>'2026-06-07 22:59:28'],
            ['id'=>38, 'user_id'=>11, 'skill_id'=>4,  'type'=>'learn', 'created_at'=>'2026-06-07 22:59:48', 'updated_at'=>'2026-06-07 22:59:48'],
        ]);

        // Enrollments
        DB::table('enrollments')->insert([
            ['id'=>1,  'user_id'=>3,  'course_id'=>1, 'status'=>'wishlist',  'progress'=>0,  'created_at'=>'2026-06-07 18:03:23', 'updated_at'=>'2026-06-07 18:26:48'],
            ['id'=>2,  'user_id'=>3,  'course_id'=>3, 'status'=>'enrolled',  'progress'=>0,  'created_at'=>'2026-06-07 18:04:16', 'updated_at'=>'2026-06-07 18:04:16'],
            ['id'=>3,  'user_id'=>3,  'course_id'=>7, 'status'=>'enrolled',  'progress'=>0,  'created_at'=>'2026-06-07 18:28:18', 'updated_at'=>'2026-06-07 18:28:18'],
            ['id'=>4,  'user_id'=>3,  'course_id'=>9, 'status'=>'enrolled',  'progress'=>0,  'created_at'=>'2026-06-07 18:39:32', 'updated_at'=>'2026-06-07 18:39:32'],
            ['id'=>5,  'user_id'=>2,  'course_id'=>1, 'status'=>'enrolled',  'progress'=>45, 'created_at'=>'2026-06-07 18:53:42', 'updated_at'=>'2026-06-07 18:53:42'],
            ['id'=>6,  'user_id'=>2,  'course_id'=>3, 'status'=>'enrolled',  'progress'=>70, 'created_at'=>'2026-06-07 18:53:42', 'updated_at'=>'2026-06-07 18:53:42'],
            ['id'=>7,  'user_id'=>2,  'course_id'=>5, 'status'=>'enrolled',  'progress'=>20, 'created_at'=>'2026-06-07 18:53:42', 'updated_at'=>'2026-06-07 18:53:42'],
            ['id'=>18, 'user_id'=>10, 'course_id'=>2, 'status'=>'enrolled',  'progress'=>0,  'created_at'=>'2026-06-07 23:02:42', 'updated_at'=>'2026-06-07 23:02:42'],
        ]);

        // Exchanges
        DB::table('exchanges')->insert([
            ['id'=>1, 'requester_id'=>6,  'requester_skill_id'=>2,  'requested_skill_id'=>4,  'target_user_id'=>1,  'status'=>'pending',  'message'=>'Hi! I can teach you English, can you teach me Python?', 'created_at'=>'2026-06-07 20:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>2, 'requester_id'=>3,  'requester_skill_id'=>2,  'requested_skill_id'=>12, 'target_user_id'=>1,  'status'=>'pending',  'message'=>'Let us exchange Figma for Python!',                    'created_at'=>'2026-06-07 17:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>3, 'requester_id'=>2,  'requester_skill_id'=>4,  'requested_skill_id'=>1,  'target_user_id'=>3,  'status'=>'pending',  'message'=>'I can teach Python in exchange for UI/UX lessons!',    'created_at'=>'2026-06-06 22:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>4, 'requester_id'=>2,  'requester_skill_id'=>6,  'requested_skill_id'=>1,  'target_user_id'=>14, 'status'=>'accepted', 'message'=>'Lets do it!',                                           'created_at'=>'2026-06-05 22:33:33', 'updated_at'=>'2026-06-07 22:33:33'],
            ['id'=>5, 'requester_id'=>9,  'requester_skill_id'=>8,  'requested_skill_id'=>8,  'target_user_id'=>1,  'status'=>'accepted', 'message'=>'Hello',                                                  'created_at'=>'2026-06-07 22:46:32', 'updated_at'=>'2026-06-07 22:47:13'],
            ['id'=>6, 'requester_id'=>11, 'requester_skill_id'=>10, 'requested_skill_id'=>11, 'target_user_id'=>4,  'status'=>'accepted', 'message'=>'Hello',                                                  'created_at'=>'2026-06-07 23:00:39', 'updated_at'=>'2026-06-07 23:01:03'],
        ]);

        // Payments
        DB::table('payments')->insert([
            ['id'=>1, 'user_id'=>4,  'amount'=>179.00, 'payment_method'=>'card', 'currency'=>'EGP', 'status'=>'completed', 'type'=>'course', 'reference_id'=>10, 'payment_date'=>'2026-06-07', 'created_at'=>'2026-06-07 18:35:46', 'updated_at'=>'2026-06-07 18:35:46'],
            ['id'=>2, 'user_id'=>3,  'amount'=>499.00, 'payment_method'=>'card', 'currency'=>'EGP', 'status'=>'completed', 'type'=>'course', 'reference_id'=>9,  'payment_date'=>'2026-06-07', 'created_at'=>'2026-06-07 18:39:31', 'updated_at'=>'2026-06-07 18:39:31'],
            ['id'=>7, 'user_id'=>10, 'amount'=>299.00, 'payment_method'=>'card', 'currency'=>'EGP', 'status'=>'completed', 'type'=>'course', 'reference_id'=>2,  'payment_date'=>'2026-06-08', 'created_at'=>'2026-06-07 23:02:40', 'updated_at'=>'2026-06-07 23:02:40'],
        ]);

        // Calendar Events
        DB::table('calendar_events')->insert([
            ['id'=>1, 'user_id'=>2, 'title'=>'Course Deadline',    'subtitle'=>'Data Analysis',  'type'=>'deadline', 'starts_at'=>'2026-06-14 23:59:44', 'ends_at'=>'2026-06-15 01:59:44', 'notes'=>null, 'color'=>'yellow', 'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
            ['id'=>2, 'user_id'=>2, 'title'=>'Meeting with Karim', 'subtitle'=>'Group discussion','type'=>'meeting',  'starts_at'=>'2026-06-12 19:00:44', 'ends_at'=>'2026-06-12 21:00:44', 'notes'=>null, 'color'=>'blue',   'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
            ['id'=>3, 'user_id'=>2, 'title'=>'Feedback Meeting',   'subtitle'=>'Group Session',  'type'=>'meeting',  'starts_at'=>'2026-06-23 18:30:44', 'ends_at'=>'2026-06-23 20:30:44', 'notes'=>null, 'color'=>'pink',   'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
            ['id'=>4, 'user_id'=>2, 'title'=>'Photoshop Class',    'subtitle'=>'With Ahmed',     'type'=>'course',   'starts_at'=>'2026-06-28 16:00:44', 'ends_at'=>'2026-06-28 18:00:44', 'notes'=>null, 'color'=>'green',  'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
        ]);

        // Calendar Sessions
        DB::table('calendar_sessions')->insert([
            ['id'=>1, 'course_id'=>4, 'user_id'=>2, 'exchange_id'=>null, 'title'=>'UI/UX Feedback Session',   'type'=>'session', 'starts_at'=>'2026-06-17 18:00:44', 'ends_at'=>'2026-06-17 19:00:44', 'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
            ['id'=>2, 'course_id'=>4, 'user_id'=>2, 'exchange_id'=>null, 'title'=>'English Speaking Practice','type'=>'session', 'starts_at'=>'2026-06-19 20:00:44', 'ends_at'=>'2026-06-19 21:00:44', 'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
            ['id'=>3, 'course_id'=>4, 'user_id'=>2, 'exchange_id'=>null, 'title'=>'Python Q&A Session',        'type'=>'session', 'starts_at'=>'2026-06-21 19:00:44', 'ends_at'=>'2026-06-21 20:00:44', 'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
            ['id'=>4, 'course_id'=>4, 'user_id'=>2, 'exchange_id'=>null, 'title'=>'Data Science Workshop',    'type'=>'session', 'starts_at'=>'2026-06-27 17:00:44', 'ends_at'=>'2026-06-27 18:00:44', 'status'=>'scheduled', 'created_at'=>'2026-06-07 18:45:44', 'updated_at'=>'2026-06-07 18:45:44'],
        ]);

        // User Notifications
        DB::table('user_notifications')->insert([
            ['id'=>1, 'user_id'=>2, 'title'=>'New Exchange Match', 'message'=>'Ahmed Hassan wants to exchange Python for UI/UX Design', 'is_read'=>0, 'created_at'=>'2026-06-07 18:44:47', 'updated_at'=>'2026-06-07 18:54:47'],
            ['id'=>2, 'user_id'=>2, 'title'=>'Session Reminder',   'message'=>'UI/UX Feedback Session starts in 1 hour',               'is_read'=>0, 'created_at'=>'2026-06-07 16:54:47', 'updated_at'=>'2026-06-07 18:54:47'],
            ['id'=>3, 'user_id'=>2, 'title'=>'New Message',        'message'=>'Ahmed Hassan sent you a message',                       'is_read'=>1, 'created_at'=>'2026-06-07 15:54:47', 'updated_at'=>'2026-06-07 18:54:47'],
            ['id'=>4, 'user_id'=>2, 'title'=>'New Exchange Match', 'message'=>'Ahmed Hassan wants to exchange Python for UI/UX Design', 'is_read'=>0, 'created_at'=>'2026-06-07 18:45:32', 'updated_at'=>'2026-06-07 18:55:32'],
            ['id'=>5, 'user_id'=>2, 'title'=>'Session Reminder',   'message'=>'UI/UX Feedback Session starts in 1 hour',               'is_read'=>0, 'created_at'=>'2026-06-07 16:55:32', 'updated_at'=>'2026-06-07 18:55:32'],
            ['id'=>6, 'user_id'=>2, 'title'=>'New Message',        'message'=>'Ahmed Hassan sent you a message',                       'is_read'=>1, 'created_at'=>'2026-06-07 15:55:32', 'updated_at'=>'2026-06-07 18:55:32'],
        ]);
    }
}
