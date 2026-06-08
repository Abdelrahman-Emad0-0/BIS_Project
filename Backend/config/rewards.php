<?php

return [

    'level_thresholds' => [
        0    => ['name' => 'Beginner', 'badge' => 'bronze',   'next' => 500,  'next_level_name' => 'Learner'],
        500  => ['name' => 'Learner',  'badge' => 'silver',   'next' => 1500, 'next_level_name' => 'Advanced'],
        1500 => ['name' => 'Advanced', 'badge' => 'gold',     'next' => 3000, 'next_level_name' => 'Expert'],
        3000 => ['name' => 'Expert',   'badge' => 'platinum', 'next' => null, 'next_level_name' => null],
    ],

    'how_you_earn' => [
        ['title' => 'Complete a Course',         'description' => 'Earn 100 points each time you finish a course'],
        ['title' => 'Complete a Skill Exchange', 'description' => 'Earn 150 points for each completed skill exchange'],
        ['title' => 'Write a Review',            'description' => 'Earn 25 points for leaving a review on a course'],
        ['title' => 'Teach a Session',           'description' => 'Earn 75 points each time you teach a live session'],
        ['title' => 'Refer a Friend',            'description' => 'Earn 200 points for every new user you refer'],
    ],

    'student_rewards' => [
        [
            'code'             => 'STUDENT_DISCOUNT_10',
            'title'            => '10% Course Discount',
            'description'      => 'Get 10% off any paid course',
            'points'           => 300,
            'discount_type'    => 'percent',
            'discount_value'   => 10,
        ],
        [
            'code'             => 'STUDENT_DISCOUNT_25',
            'title'            => '25% Course Discount',
            'description'      => 'Get 25% off any paid course',
            'points'           => 750,
            'discount_type'    => 'percent',
            'discount_value'   => 25,
        ],
        [
            'code'             => 'FREE_COURSE',
            'title'            => 'One Free Course',
            'description'      => 'Redeem one free course (up to EGP 200)',
            'points'           => 1500,
            'discount_type'    => 'free',
            'discount_value'   => 200,
        ],
    ],

    'instructor_rewards' => [
        [
            'code'        => 'INSTRUCTOR_BADGE',
            'title'       => 'Top Instructor Badge',
            'description' => 'Display a Top Instructor badge on your profile',
            'points'      => 500,
        ],
        [
            'code'        => 'FEATURED_COURSE',
            'title'       => 'Featured Course Slot',
            'description' => 'Get one of your courses featured on the homepage for 7 days',
            'points'      => 1000,
        ],
        [
            'code'        => 'REVENUE_BOOST',
            'title'       => 'Revenue Share Boost',
            'description' => 'Get 5% extra revenue share for one month',
            'points'      => 2000,
        ],
    ],

];
