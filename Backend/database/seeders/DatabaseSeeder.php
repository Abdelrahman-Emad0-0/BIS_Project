<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Teacher account
        $teacher = User::create([
            'name'          => 'Ahmed Hassan',
            'email'         => 'teacher@learnxchange.com',
            'phone'         => '01100000001',
            'password'      => Hash::make('password123'),
            'role'          => 'teacher',
            'gender'        => 'male',
            'date_of_birth' => '1990-05-15',
        ]);

        // Admin account
        User::create([
            'name'          => 'Admin',
            'email'         => 'admin@learnxchange.com',
            'phone'         => '01100000002',
            'password'      => Hash::make('password123'),
            'role'          => 'admin',
            'gender'        => 'male',
            'date_of_birth' => '1985-01-01',
        ]);

        $courses = [
            [
                'title'        => 'Complete Python Bootcamp',
                'category'     => 'Programming',
                'description'  => 'Learn Python from scratch. Covers basics, OOP, file handling, APIs, and data science foundations. Perfect for absolute beginners.',
                'price'        => 0,
                'capacity'     => 50,
                'duration'     => '8 weeks',
                'created_date' => '2026-05-01',
                'ended_date'   => '2026-06-30',
            ],
            [
                'title'        => 'Web Development with React & Next.js',
                'category'     => 'Programming',
                'description'  => 'Master modern frontend development using React 18 and Next.js 14. Build real-world projects with TypeScript and Tailwind CSS.',
                'price'        => 299,
                'capacity'     => 30,
                'duration'     => '10 weeks',
                'created_date' => '2026-05-10',
                'ended_date'   => '2026-07-20',
            ],
            [
                'title'        => 'UI/UX Design Fundamentals',
                'category'     => 'Design',
                'description'  => 'Learn design thinking, wireframing, prototyping in Figma, and usability principles. Create stunning user interfaces from scratch.',
                'price'        => 199,
                'capacity'     => 25,
                'duration'     => '6 weeks',
                'created_date' => '2026-05-15',
                'ended_date'   => '2026-06-25',
            ],
            [
                'title'        => 'Digital Marketing Mastery',
                'category'     => 'Marketing',
                'description'  => 'SEO, social media marketing, email campaigns, Google Ads, and analytics. Grow any business online with proven strategies.',
                'price'        => 149,
                'capacity'     => 40,
                'duration'     => '5 weeks',
                'created_date' => '2026-05-20',
                'ended_date'   => '2026-06-24',
            ],
            [
                'title'        => 'Arabic Language for Beginners',
                'category'     => 'Languages',
                'description'  => 'Start speaking Arabic from day one. Covers Modern Standard Arabic (MSA) and conversational Egyptian dialect with native speaker recordings.',
                'price'        => 0,
                'capacity'     => 60,
                'duration'     => '12 weeks',
                'created_date' => '2026-06-01',
                'ended_date'   => '2026-08-24',
            ],
            [
                'title'        => 'Data Science with Python & Pandas',
                'category'     => 'Data Science',
                'description'  => 'Analyze real datasets using Python, Pandas, NumPy, Matplotlib and Seaborn. Includes 5 hands-on projects with real-world data.',
                'price'        => 349,
                'capacity'     => 20,
                'duration'     => '8 weeks',
                'created_date' => '2026-05-25',
                'ended_date'   => '2026-07-20',
            ],
            [
                'title'        => 'Photography: From Auto to Manual',
                'category'     => 'Photography',
                'description'  => 'Master your DSLR or mirrorless camera. Learn composition, lighting, exposure triangle, portrait and landscape photography.',
                'price'        => 99,
                'capacity'     => 30,
                'duration'     => '4 weeks',
                'created_date' => '2026-06-01',
                'ended_date'   => '2026-06-29',
            ],
            [
                'title'        => 'English Speaking & Pronunciation',
                'category'     => 'Languages',
                'description'  => 'Improve your English fluency, reduce your accent and gain confidence in professional and casual conversations.',
                'price'        => 0,
                'capacity'     => 50,
                'duration'     => '6 weeks',
                'created_date' => '2026-06-05',
                'ended_date'   => '2026-07-17',
            ],
            [
                'title'        => 'Machine Learning A-Z',
                'category'     => 'Data Science',
                'description'  => 'Supervised and unsupervised learning, neural networks, and model evaluation. Hands-on with scikit-learn and TensorFlow.',
                'price'        => 499,
                'capacity'     => 15,
                'duration'     => '14 weeks',
                'created_date' => '2026-05-01',
                'ended_date'   => '2026-08-07',
            ],
            [
                'title'        => 'Graphic Design with Adobe Illustrator',
                'category'     => 'Design',
                'description'  => 'Learn vector design, logo creation, brand identity, and print design. Build a professional design portfolio by the end.',
                'price'        => 179,
                'capacity'     => 25,
                'duration'     => '7 weeks',
                'created_date' => '2026-05-18',
                'ended_date'   => '2026-07-06',
            ],
        ];

        foreach ($courses as $course) {
            DB::table('courses')->insert(array_merge($course, [
                'teacher_id' => $teacher->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
