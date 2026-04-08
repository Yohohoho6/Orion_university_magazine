-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 30, 2026 at 06:23 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ewsd_backend`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_years`
--

CREATE TABLE `academic_years` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `closure_date` date NOT NULL,
  `final_closure_date` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_years`
--

INSERT INTO `academic_years` (`id`, `name`, `start_date`, `end_date`, `closure_date`, `final_closure_date`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Academic Year 2023-2024', '2023-09-01', '2024-06-30', '2024-03-15', '2024-03-30', 0, '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(2, 'Academic Year 2024-2025', '2024-09-01', '2025-06-30', '2025-03-14', '2025-03-28', 0, '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(3, 'Academic Year 2025-2026', '2025-09-01', '2026-06-30', '2026-03-25', '2026-03-31', 1, '2026-03-14 15:05:58', '2026-03-17 15:47:57');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(191) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(191) NOT NULL,
  `owner` varchar(191) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `type`, `created_at`, `updated_at`) VALUES
(1, 'Research Papers', 'Academic and scholarly research works.', 'article', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(2, 'Projects', 'Individual or group academic projects.', 'article', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(3, 'Creative Writing', 'Poetry, stories, and creative written content.', 'article', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(4, 'Reviews (Literature and Books)', 'Critical reviews of literature and books.', 'article', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(5, 'Extracurriculars', 'Activities beyond academic curriculum.', 'article', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(6, 'Campus Photography', 'Photography capturing campus life.', 'gallery', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(7, 'Artistic Photography', 'Creative and artistic photography.', 'gallery', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(8, 'Event Photography', 'Photos from events and functions.', 'gallery', '2026-03-14 15:05:58', '2026-03-14 15:05:58'),
(9, 'Experimental Images', 'Innovative and experimental visual works.', 'gallery', '2026-03-14 15:05:58', '2026-03-14 15:05:58');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `contribution_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `content`, `parent_id`, `contribution_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Well done good work', NULL, 1, 3, '2026-03-15 03:28:16', '2026-03-15 03:28:16'),
(2, 'This work highlights both traditional reliability issues and the new challenges faced in modern systems. The discussion is relevant to current technological developments.', NULL, 2, 3, '2026-03-15 03:31:25', '2026-03-15 03:31:25'),
(3, 'The article clearly explains how organizations rely on underlying assumptions about their markets and capabilities, highlighting the importance of regularly reviewing these assumptions.', NULL, 7, 4, '2026-03-15 03:47:35', '2026-03-15 03:47:35'),
(4, 'The topic provides an interesting look at the financial and market factors involved in the publishing industry.', NULL, 8, 4, '2026-03-15 03:47:55', '2026-03-15 03:47:55'),
(5, 'This submission introduces the idea that simple computational rules can produce complex behaviors, offering a different perspective on scientific research.', NULL, 6, 5, '2026-03-15 03:48:40', '2026-03-15 03:48:40'),
(6, 'The article effectively discusses the relationship between creativity and scientific discovery, showing how imagination supports innovation in science.', NULL, 5, 5, '2026-03-15 03:48:56', '2026-03-15 03:48:56'),
(7, 'The image effectively captures the campus environment and reflects the atmosphere of student life.', NULL, 10, 6, '2026-03-15 03:50:04', '2026-03-15 03:50:04'),
(8, 'The submission briefly explains the concept of quantum computing and its potential applications in advanced computational problems.', NULL, 4, 7, '2026-03-15 03:50:54', '2026-03-15 03:50:54'),
(9, 'The article gives a clear introduction to soft computing techniques and their importance in solving complex problems involving uncertainty and approximation.', NULL, 3, 7, '2026-03-15 03:51:12', '2026-03-15 03:51:12'),
(10, 'Thank you for the feedback. The purpose of this article is to introduce the basic concepts of soft computing.', 9, 3, 14, '2026-03-15 03:53:25', '2026-03-15 03:53:25'),
(11, 'I appreciate the coordinator’s comments and review.', 8, 4, 15, '2026-03-15 03:54:34', '2026-03-15 03:54:34'),
(12, 'This submission effectively highlights the role of creativity, intuition, and diverse thinking in engineering. The discussion is clear and demonstrates how innovative approaches complement technical knowledge in problem-solving and design.', NULL, 11, 3, '2026-03-17 15:58:44', '2026-03-17 15:58:44'),
(13, 'This image clearly demonstrates the fundamentals of electrical engineering. The setup effectively illustrates the flow of current and the working of basic circuit components, making the experiment easy to understand and educational.', NULL, 12, 3, '2026-03-17 16:04:56', '2026-03-17 16:04:56'),
(14, 'The study provides a clear analysis of participation patterns between male and female engineering students. The discussion is insightful and highlights important considerations for creating inclusive and engaging extracurricular opportunities.', NULL, 13, 3, '2026-03-17 16:07:20', '2026-03-17 16:07:20'),
(15, 'The photograph effectively captures the energy and creativity of the event. It highlights student projects and innovations while showcasing collaboration, practical application of engineering concepts, and problem-solving skills.', NULL, 14, 3, '2026-03-17 16:18:21', '2026-03-17 16:18:21'),
(16, 'The paper effectively demonstrates how AI techniques are integrated into various engineering fields. It clearly explains the practical benefits, problem-solving capabilities, and potential of AI to enhance efficiency and innovation in engineering applications.', NULL, 15, 3, '2026-03-17 16:20:14', '2026-03-17 16:20:14'),
(17, 'The paper provides a comprehensive review of service learning in engineering education. It effectively highlights trends, key themes, and the impact of community-based projects on student learning and professional development.', NULL, 16, 3, '2026-03-17 16:21:48', '2026-03-17 16:21:48'),
(18, 'The paper provides a thorough analysis of relationship marketing models and their impact on business performance. It clearly demonstrates how trust, satisfaction, and commitment influence client relationships, offering valuable insights for practical B2B strategies.', NULL, 19, 4, '2026-03-17 16:50:24', '2026-03-17 16:50:24'),
(19, 'The literature review effectively synthesizes key research on competitive advantage, covering both classical and modern perspectives. It highlights important frameworks and provides a clear understanding of how businesses can sustain their market position.', NULL, 20, 4, '2026-03-17 16:50:41', '2026-03-17 16:50:41'),
(20, 'The photograph captures the collaborative and dynamic environment of the business classroom. It effectively reflects teamwork, engagement, and practical learning, showcasing the spirit of business education on campus.', NULL, 21, 4, '2026-03-17 16:50:54', '2026-03-17 16:50:54'),
(21, 'The experimental images clearly demonstrate how different packaging designs can influence consumer perception and preference. The study effectively highlights the role of visual elements in marketing strategy and product appeal.', NULL, 22, 4, '2026-03-17 16:51:58', '2026-03-17 16:51:58'),
(22, 'The submission provides a clear evaluation of the activities and impact of the science club. It effectively highlights student engagement, organization, and the role of such clubs in promoting scientific interest.', NULL, 26, 5, '2026-03-18 03:00:22', '2026-03-18 03:00:22'),
(23, 'The photograph captures the innovation and enthusiasm of the event. It clearly reflects student involvement, creativity, and the practical application of scientific knowledge.', NULL, 27, 5, '2026-03-18 03:00:38', '2026-03-18 03:00:38'),
(24, 'The review presents a concise overview of how biotechnology contributes to agricultural development. It effectively explains key applications and their importance in improving productivity and sustainability.', NULL, 28, 5, '2026-03-18 03:00:53', '2026-03-18 03:00:53'),
(25, 'The project demonstrates a practical and environmentally friendly approach to water purification. It clearly shows the application of scientific principles to solve real-world problems.', NULL, 29, 5, '2026-03-18 03:01:03', '2026-03-18 03:01:03'),
(26, 'The photograph effectively captures contrast and composition, demonstrating a strong understanding of light and shadow. It conveys emotion and artistic intent clearly.', NULL, 9, 6, '2026-03-18 05:21:43', '2026-03-18 05:21:43'),
(27, 'This image skillfully uses color, texture, and composition to convey creativity and emotion. It shows a thoughtful exploration of visual art principles.', NULL, 32, 6, '2026-03-18 05:21:57', '2026-03-18 05:21:57'),
(28, 'The photograph successfully depicts students engaged in hands-on artistic activities. It highlights collaboration, learning, and the dynamic environment of the art faculty.', NULL, 33, 6, '2026-03-18 05:22:26', '2026-03-18 05:22:26'),
(29, 'The poem beautifully illustrates the relationship between artist and canvas. It conveys emotion and the creative process through vivid imagery and thoughtful rhythm.', NULL, 34, 6, '2026-03-18 05:22:45', '2026-03-18 05:22:45'),
(30, 'The work effectively analyzes street art as a form of social and political expression. It demonstrates strong research, critical thinking, and understanding of cultural context.', NULL, 35, 6, '2026-03-18 05:22:55', '2026-03-18 05:22:55'),
(31, 'The paper clearly explains a powerful machine learning framework and its applications in modern computing.', NULL, 38, 7, '2026-03-18 10:27:04', '2026-03-18 10:27:04'),
(32, 'The image effectively captures teamwork, innovation, and the fast-paced nature of hackathon events.', NULL, 39, 7, '2026-03-18 10:27:17', '2026-03-18 10:27:17'),
(33, 'The photograph reflects an engaging and collaborative computing environment among students.', NULL, 40, 7, '2026-03-18 10:27:32', '2026-03-18 10:27:32'),
(34, 'The project demonstrates a practical and well-structured solution for managing digital content efficiently.', NULL, 41, 7, '2026-03-18 10:27:45', '2026-03-18 10:27:45'),
(35, 'The review provides a clear overview of key machine learning methods and their importance in computing.', NULL, 43, 7, '2026-03-18 10:27:59', '2026-03-18 10:27:59'),
(36, 'Thanks for giving feedback.', 16, 15, 26, '2026-03-20 15:51:42', '2026-03-20 15:51:42'),
(37, 'Thanks for the review comment.', NULL, 14, 26, '2026-03-20 16:42:28', '2026-03-20 16:42:28'),
(38, 'You\'re welcome thanks for the effort to submit this contribution.', NULL, 14, 3, '2026-03-20 16:46:31', '2026-03-20 16:46:31'),
(39, 'good', NULL, 18, 3, '2026-03-22 05:29:24', '2026-03-22 05:29:24'),
(40, 'good', NULL, 17, 3, '2026-03-22 05:29:41', '2026-03-22 05:29:41');

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`id`, `full_name`, `email`, `subject`, `message`, `is_read`, `read_at`, `created_at`, `updated_at`) VALUES
(1, 'Khun Htet', 'khun@university.edu', 'Request for Feedback', 'I would like to request feedback on my recent submission. Could you please review and provide comments?', 1, '2026-03-21 16:39:09', '2026-03-21 16:31:00', '2026-03-21 16:39:09'),
(2, 'Mark Zoe', 'zoe@gmail.com', 'Inquiry About Contributions', 'I would like to know how external users can view or contribute to the platform. Please provide details.', 1, '2026-03-21 16:39:13', '2026-03-21 16:32:40', '2026-03-21 16:39:13'),
(3, 'Joey Linn', 'joey@gmail.com', 'Access to Published Content', 'I am interested in accessing student contributions. Could you guide me on how to view them?', 1, '2026-03-21 16:39:53', '2026-03-21 16:33:28', '2026-03-21 16:39:53'),
(4, 'Sydney Lwin', 'sydney@gmail.com', 'System Performance Issue', 'The platform appears to be slow during peak hours. Please investigate and resolve the issue.', 1, '2026-03-21 17:07:43', '2026-03-21 16:38:11', '2026-03-21 17:07:43'),
(5, 'Zai Yu', 'zai@gmail.com', 'Login Problem', 'I am having trouble logging into my account even with correct credentials. Kindly assist.', 1, '2026-03-21 17:07:45', '2026-03-21 16:42:50', '2026-03-21 17:07:45'),
(6, 'Vanex May', 'may@gmail.com', 'File Format Issue', 'The system is not accepting my file format during upload. Please advise on supported formats.', 1, '2026-03-21 17:07:49', '2026-03-21 16:47:44', '2026-03-21 17:07:49'),
(7, 'Gabriel Pai', 'gabriel@gmail.com', 'General Information Request', 'I would like to learn more about the purpose and features of this platform. Please provide details.', 1, '2026-03-21 17:07:53', '2026-03-21 16:57:06', '2026-03-21 17:07:53'),
(8, 'Nwaneri Aung', 'nwaneri@gmail.com', 'Viewing Event Updates', 'How can I stay updated with the latest events and activities on this platform?', 1, '2026-03-21 17:07:53', '2026-03-21 17:02:09', '2026-03-21 17:07:53'),
(9, 'Finn Harbour', 'finn@gmail.com', 'Contribution Guidelines', 'Are there any guidelines or requirements for viewing or sharing content on this platform?', 0, NULL, '2026-03-21 17:05:13', '2026-03-21 17:05:13'),
(10, 'Honey Nway', 'honey@gmail.com', 'Technical Issue While Browsing', 'I encountered an issue while browsing the website. Some pages are not loading properly. Please check.', 0, NULL, '2026-03-21 17:06:05', '2026-03-21 17:06:05');

-- --------------------------------------------------------

--
-- Table structure for table `contributions`
--

CREATE TABLE `contributions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `summary` text DEFAULT NULL,
  `file_path` varchar(191) NOT NULL,
  `cover_photo_path` varchar(191) DEFAULT NULL,
  `status` enum('pending','commented','selected','rejected') NOT NULL DEFAULT 'pending',
  `is_selected` tinyint(1) NOT NULL DEFAULT 0,
  `terms_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `academic_year_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `faculty_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contributions`
--

INSERT INTO `contributions` (`id`, `title`, `description`, `summary`, `file_path`, `cover_photo_path`, `status`, `is_selected`, `terms_accepted`, `academic_year_id`, `category_id`, `faculty_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Biocommondity Engineering', 'Biocommodity Engineering is the study of converting biological resources into useful products such as biofuels, bioplastics, and bio-based materials. It combines engineering and biotechnology to use renewable resources efficiently and support sustainable development.', NULL, 'contributions/1773503071_Biocommodity Engineering.pdf', 'contributions/covers/1773503071_cover_biocommondity_cover.jpg', 'selected', 1, 1, 3, 1, 1, 13, '2026-03-03 15:44:31', '2026-03-03 03:28:23'),
(2, 'Reliability engineering: Old problems and new challenges', 'Reliability engineering focuses on ensuring that systems and products operate without failure over time. While traditional challenges involve improving durability and reducing system failures, modern technologies introduce new issues such as complex software systems and interconnected devices. Addressing both old and new challenges is essential to maintain system reliability and performance.', NULL, 'contributions/1773510423_RELIABILITY_ENGINEERING_OLD_PROBLEMS_AND_NEW_CHALLENGES.pdf', 'contributions/covers/1773510423_cover_images.jpg', 'selected', 1, 1, 3, 1, 1, 23, '2026-03-02 17:47:03', '2026-03-03 15:56:58'),
(3, 'An Overview of Soft Computing', 'Soft computing is a set of computational techniques used to solve complex problems that are difficult to model using traditional methods. It includes approaches such as fuzzy logic, neural networks, and genetic algorithms. Soft computing allows systems to handle uncertainty, imprecision, and approximate reasoning effectively.', 'Advantages: \n- Fast and efficient processing of data. \n- Ability to perform generalization and learn from examples. \n- Suitable for solving complex, nonlinear problems. \n- Ability to make the system fault-tolerant by training the network so that it can learn from noisy data. \nDisadvantages: \n- Requires large amounts of data to train the network. \n- Requires specialized software for training. \n- Difficult to interpret the network. \nThe architecture of neural networks can vary, depending on whether the problem to be solved is classification, \nforecasting, or function approximation. \n4. Genetic algorithms \nGenetic algorithms are optimization methods that use the principles of natural selection and inheritance to \nfind the best solution to a given problem\n15\n.\nThese algorithms are inspired by the theory of evolution and are based on populations of possible solutions, with \nselection, mutation, and recombination. \nGenetic algorithms are based on the idea that the best solution to the problem will survive, similar to the natural \nprocess of survival of the fittest in nature. The algorithm starts with an initial population of possible solutions \nand evaluates their fitness using a fitness function. Those solutions with higher fitness will be selected to produce the \nnext generation of solutions.', 'contributions/1773510684_1-s2.0-S1877050916325467-main.pdf', 'contributions/covers/1773510685_cover_softcom.jpg', 'selected', 1, 1, 3, 1, 5, 14, '2026-03-03 17:51:25', '2026-03-28 15:53:39'),
(4, 'Quantum computing', 'Quantum computing uses principles of quantum mechanics to process information. It uses quantum bits (qubits) that can represent multiple states at once, allowing faster processing for certain complex problems compared to classical computers. It has potential applications in cryptography, optimization, and scientific research.', NULL, 'contributions/1773510851_quantumcom.pdf', 'contributions/covers/1773510851_cover_quancom.jpg', 'selected', 1, 1, 3, 1, 5, 15, '2026-03-03 17:54:11', '2026-03-04 03:51:00'),
(5, 'The Art of Science', 'The Art of Science explores the connection between creativity and scientific discovery. It highlights how imagination, curiosity, and creative thinking play an important role in advancing scientific knowledge and innovation.', NULL, 'contributions/1773511142_artofscience.pdf', 'contributions/covers/1773511142_cover_aos.jpg', 'selected', 1, 1, 3, 1, 3, 18, '2026-03-06 17:59:02', '2026-03-07 03:49:23'),
(6, 'A new kind of science', 'A New Kind of Science explores how simple computational rules can create complex patterns and behaviors. It suggests that studying these simple programs can help explain many natural phenomena and provide new ways of understanding science and technology.', NULL, 'contributions/1773511406_scireview.pdf', 'contributions/covers/1773511406_cover_newkindofsci.jpg', 'selected', 1, 1, 3, 4, 3, 21, '2026-03-06 18:03:26', '2026-03-07 02:43:44'),
(7, 'The Theory of the Business', 'The Theory of the Business explains how organizations succeed by clearly defining their assumptions about customers, markets, and core strengths. It emphasizes that businesses must regularly review and update these assumptions to adapt to changing environments and maintain effectiveness.', NULL, 'contributions/1773512353_8-the-theory-of-the-business.pdf', 'contributions/covers/1773512353_cover_tobus.jpg', 'selected', 1, 1, 3, 1, 2, 20, '2026-03-06 18:19:13', '2026-03-07 03:47:43'),
(8, 'The economics of books', 'The Economics of Books examines the financial and market factors involved in producing, publishing, and selling books. It explores how costs, pricing, demand, and distribution affect the publishing industry and the availability of books to readers.', NULL, 'contributions/1773512701_ecobooks.pdf', 'contributions/covers/1773512701_cover_16093522.jpg', 'selected', 1, 1, 3, 4, 2, 19, '2026-03-06 18:25:01', '2026-03-07 16:49:08'),
(9, 'Harmony of Light and Shadow', 'An artistic photograph capturing the balance between light and shadow, highlighting the beauty of contrast and visual composition. The image emphasizes creativity and emotional expression through perspective, texture, and lighting.', NULL, 'contributions/1773512957_light-shadow-photograph.jpg', 'contributions/covers/1773512957_cover_shadow-dance_23-2151951114.jpg', 'selected', 1, 1, 3, 7, 4, 16, '2026-03-07 18:29:17', '2026-03-18 05:21:48'),
(10, 'Life Around Campus', 'A campus photograph capturing the daily atmosphere of university life, highlighting the environment, architecture, and moments that reflect student activities and the vibrant spirit of the campus.', NULL, 'contributions/1773513134_360_F_908347618_gdkax9OgUtUTnF6fCh0X9Pfm792Zh6tU.jpg', 'contributions/covers/1773513134_cover_hero-needs-crop-scan0028-A.jpg', 'selected', 1, 1, 3, 6, 4, 17, '2026-03-07 18:32:14', '2026-03-08 03:50:08'),
(11, 'Creative Ways of Knowing in Engineering', 'Creative Ways of Knowing in Engineering explores how engineers use creativity, intuition, and diverse thinking approaches alongside technical knowledge. It emphasizes that innovation in engineering comes not only from logic and analysis but also from imagination and new perspectives.', NULL, 'contributions/1773759953_Creative_Ways_of_Knowing_in_Engineering.pdf', 'contributions/covers/1773759953_cover_creative_thinking_and_innovative_mind_of_engineer_slide01.jpg', 'selected', 1, 1, 3, 3, 1, 24, '2026-03-08 15:05:53', '2026-03-08 15:58:52'),
(12, 'Simple Circuit Experiment', 'A basic electrical circuit demonstrating the flow of current through connected components, where a power source activates an LED, illustrating fundamental principles of electrical engineering.', NULL, 'contributions/1773760311_hq720.jpg', 'contributions/covers/1773760311_cover_v4-460px-Make-a-Circuit-Step-12.jpg', 'selected', 1, 1, 3, 9, 1, 25, '2026-03-08 15:11:51', '2026-03-08 16:05:22'),
(13, 'Gender Differences in Extracurricular Activities of Engineering Students', 'This study examines how participation in extracurricular activities differs between male and female engineering students. It explores variations in interests, involvement levels, and possible influencing factors such as social norms and academic demands, highlighting the importance of inclusive opportunities for all students.', NULL, 'contributions/1773760766_Outside_the_classroom_Gender_differences.pdf', 'contributions/covers/1773760766_cover_Kids-Building-Robots-in-Engineering-Class-1421313308_6720x4480-scaled.jpeg', 'selected', 1, 1, 3, 5, 1, 25, '2026-03-08 15:19:26', '2026-03-09 16:18:39'),
(14, 'Engineering Innovation Showcase', 'An engineering event where students present innovative projects and prototypes, demonstrating practical applications of engineering concepts, creativity, and problem-solving skills.', NULL, 'contributions/1773761016_138127019_15599911519641n.jpg', 'contributions/covers/1773761016_cover_Innovation-Showcase-FA2024-EG-4102-a-crop-1024x576.jpg', 'selected', 1, 1, 3, 8, 1, 26, '2026-03-08 15:23:36', '2026-03-21 16:04:06'),
(15, 'Applications of Artificial Intelligence in Engineering', 'This paper discusses how artificial intelligence techniques are applied in various engineering fields to improve efficiency, decision-making, and automation. It highlights the growing importance of AI in solving complex engineering problems.', 'Here are three clear, professional bullet points summarizing the university article on Artificial Intelligence in Civil Engineering:\n\n* Artificial Intelligence (AI) has been increasingly applied in civil engineering to solve complex optimization problems, with various techniques such as Evolutionary Computation, Neural Networks, and Swarm Intelligence being used to improve the efficiency and accuracy of engineering designs, constructions, and management.\n* AI-based methods have been successfully applied to various civil engineering problems, including structural optimization, construction scheduling, project management, and infrastructure maintenance, with benefits such as improved decision-making, reduced costs, and enhanced safety.\n* The article reviews recent progress in AI applications in civil engineering, highlighting the potential of AI techniques to transform the field and outlining future research directions, including the development of more advanced AI algorithms, the integration of AI with other technologies, and the exploration of new applications in areas such as sustainable infrastructure and smart cities.', 'contributions/1773761603_Mathematical Problems in Engineering - 2012 - Lu - Artificial Intelligence in Civil Engineering.pdf', 'contributions/covers/1773761603_cover_1695989242381.jpg', 'selected', 1, 1, 3, 1, 1, 26, '2026-03-09 15:33:23', '2026-03-28 15:47:01'),
(16, 'The Evolution of Service Learning in Engineering Education', 'This paper reviews the growth and thematic development of research on service learning within engineering education over nearly three decades. It identifies key themes such as project-based learning, student experiences, and integration of community engagement into engineering curricula while outlining future research directions.', NULL, 'contributions/1773761970_The evolution of service learning in engineering education  a bibliometric review of research  1995 2023 .pdf', 'contributions/covers/1773761970_cover_images (1).jpg', 'selected', 1, 1, 3, 1, 1, 22, '2026-03-09 15:39:30', '2026-03-22 05:29:55'),
(17, 'Semantic Networks for Engineering Design', 'This paper surveys research on the use of semantic networks—graph-based structures that capture relationships between concepts—in engineering design. It discusses how semantic networks support knowledge representation and retrieval in design systems and identifies future research directions.', 'Here are three clear, professional bullet points summarizing the article:\n\n* The use of semantic networks in engineering design has gained significant attention in recent years, with researchers leveraging large-scale pre-trained graph knowledge databases to support various design activities, such as knowledge extraction, prior art search, idea generation, and evaluation.\n* Current semantic networks, such as WordNet and ConceptNet, are primarily used in engineering design research, but their general knowledge and common-sense relations may not be sufficient to support engineering-specific tasks, leading to the development of new semantic networks like B-Link and TechNet, which are specifically designed for engineering and technical knowledge representation.\n* Future research directions for semantic networks in engineering design include the development of larger, more comprehensive networks that can cover multiple domains and support various design stages, as well as the integration of semantic networks with other AI techniques, such as machine learning and natural language processing, to enhance their capabilities and applications in engineering design research and practice.', 'contributions/1773762641_Manuscript - Semantic Network Final - For Submission.pdf', 'contributions/covers/1773762641_cover_SN.jpg', 'selected', 1, 1, 3, 1, 1, 13, '2026-03-09 15:50:41', '2026-03-28 15:46:09'),
(18, 'Engineering Tech Expo 2026', 'Students and professionals showcase innovative engineering projects, prototypes, and technologies at the expo. The event highlights practical applications of engineering concepts, teamwork, and problem-solving skills.', NULL, 'contributions/1773762919_ME-Week-Day-1-167-1-scaled.jpg', 'contributions/covers/1773762919_cover_1772208025779.jpg', 'selected', 1, 1, 3, 8, 1, 13, '2026-03-09 15:55:19', '2026-03-22 05:29:28'),
(19, 'The Effects of Relationship Marketing on Share of Business – A Synthesis and Comparison of Models', 'This paper synthesizes empirical research on relationship marketing (RM) and compares different conceptual models to understand how relational factors such as communication, trust, satisfaction, and commitment influence a seller’s share of business in a business‑to‑business context. The authors tested four models using survey data from 948 client firms and found that customer commitment directly drives business share, while trust and satisfaction indirectly contribute by strengthening commitment. The paper highlights implications for B2B service providers in enhancing customer relationships to improve performance.', NULL, 'contributions/1773765007_The_Effects_of_Relationship_Marketing_on.pdf', 'contributions/covers/1773765007_cover_businessmodel-85ce9a0a59e642cd941204a92ee873de.png', 'selected', 1, 1, 3, 1, 2, 27, '2026-03-09 16:30:07', '2026-03-09 16:50:28'),
(20, 'A Comprehensive Literature Review in Competitive Advantages of Businesses', 'This literature review examines key research on competitive advantage in business, exploring foundational theories and contemporary perspectives. It synthesizes studies on how firms achieve and sustain competitive advantage through strategic positioning, resources and capabilities, innovation, and market dynamics. The review highlights influential frameworks such as Porter’s competitive strategies and the resource‑based view, and discusses emerging trends in competitive research, offering insights for both academics and practitioners.', NULL, 'contributions/1773765292_A_Comprehensive_Literature_Review_in_Com.pdf', 'contributions/covers/1773765292_cover_Competitive-Advantage-2e2b91379cd04760bf100a3b5941ae02.jpg', 'selected', 1, 1, 3, 4, 2, 27, '2026-03-10 16:34:52', '2026-03-10 16:50:45'),
(21, 'Business Students in Action', 'A candid campus photograph capturing business students collaborating on projects and discussions. The image reflects teamwork, learning, and the dynamic environment of business education on campus.', NULL, 'contributions/1773765604_mba_class.jpg', 'contributions/covers/1773765604_cover_mun_biz-03b-Copy-e1644502634794.jpg', 'commented', 0, 1, 3, 6, 2, 20, '2026-03-10 16:40:04', '2026-03-10 16:50:55'),
(22, 'Packaging Design Comparison', 'Comparing the effectiveness of different packaging designs on consumer perception and brand appeal.', NULL, 'contributions/1773765891_SSI_1720_copy.jpg', 'contributions/covers/1773765891_cover_history.jpg', 'commented', 0, 1, 3, 9, 2, 27, '2026-03-10 16:44:51', '2026-03-10 16:51:58'),
(23, 'NARRATIVE STRATEGIES', 'This creative writing piece explores the art of storytelling in business. It highlights how narrative techniques can communicate strategy, inspire teams, and engage stakeholders, showing that effective business communication goes beyond data and charts.', NULL, 'contributions/1773767524_2020_Narrative_Strategies.pdf', 'contributions/covers/1773767524_cover_1631312324298.jpg', 'pending', 0, 1, 3, 3, 2, 28, '2026-03-11 17:12:04', '2026-03-11 17:12:04'),
(24, 'The Impact of Digital Marketing on Consumer Behavior', 'This paper examines how digital marketing strategies, including social media, online advertising, and content marketing, influence consumer behavior. It highlights how digital platforms shape purchasing decisions, brand awareness, and customer engagement in modern business environments.', NULL, 'contributions/1773798285_The_Effects_of_Relationship_Marketing_on.pdf', 'contributions/covers/1773798285_cover_images.jpg', 'pending', 0, 1, 3, 1, 2, 19, '2026-03-11 01:44:45', '2026-03-11 01:44:45'),
(25, 'Business Seminar and Networking Event', 'A business faculty event where students and professionals engage in seminars, presentations, and networking activities. The image captures knowledge sharing, professional interaction, and real-world business exposure.', NULL, 'contributions/1773798564_images (1).jpg', 'contributions/covers/1773798564_cover_business-admin-slider1.jpg', 'pending', 0, 1, 3, 8, 2, 27, '2026-03-11 01:49:24', '2026-03-11 01:49:24'),
(26, 'Examination of a Successful and Active Science Club', 'Students participate in hands-on experiments during a science club activity, exploring scientific concepts through practical learning. The event encourages curiosity, teamwork, and the application of theoretical knowledge.', NULL, 'contributions/1773799214_EJ1132085.pdf', 'contributions/covers/1773799214_cover_PG-11-e1726596413779-1200x891.jpg', 'selected', 1, 1, 3, 5, 3, 29, '2026-03-12 02:00:14', '2026-03-18 03:00:27'),
(27, 'Science Exhibition Day', 'An engaging science faculty event where students present experiments, models, and research projects. The image captures innovation, curiosity, and the practical application of scientific knowledge.', NULL, 'contributions/1773799538_experiment_at_sed_2025_web.jpg', 'contributions/covers/1773799538_cover_fos_image.jpg', 'selected', 1, 1, 3, 8, 3, 29, '2026-03-12 02:05:38', '2026-03-18 03:00:42'),
(28, 'APPLICATIONS OF BIOTECHNOLOGY IN AGRICULTURE', 'This review explores recent developments in biotechnology, including genetic engineering, medical applications, and agricultural innovations. It summarizes key research trends and discusses the impact of biotechnology on science, industry, and society.', NULL, 'contributions/1773800020_Applications_of_Biotechnology_in_Agricul.pdf', 'contributions/covers/1773800020_cover_40011_2021_1320_Figa_HTML.png', 'commented', 0, 1, 3, 4, 3, 30, '2026-03-18 02:13:40', '2026-03-18 03:00:53'),
(29, 'Water Purification Using Natural Filtration', 'This project demonstrates a simple water purification system using natural materials such as sand, gravel, and charcoal. It highlights basic environmental science principles and provides an affordable method for improving water quality.', NULL, 'contributions/1773800472_BABU CHAUDHURI 2005 Home Water Treatment by Direct Filtration with Natural Coagulant.pdf', 'contributions/covers/1773800472_cover_1750258705144.jpg', 'commented', 0, 1, 3, 2, 3, 30, '2026-03-18 02:21:12', '2026-03-18 03:01:03'),
(30, 'Chemical Reaction Color Change', 'An experiment showing chemical reactions through visible color changes, demonstrating reaction processes and properties of substances.', NULL, 'contributions/1773800670_Color-Changing-Chemistry-Clock-Left-Brain-Craft-Brain-featured.jpg', 'contributions/covers/1773800670_cover_Color-Changing-Chemistry-Clock-Left-Brain-Craft-Brain-510x866.jpg', 'pending', 0, 1, 3, 9, 3, 21, '2026-03-18 02:24:30', '2026-03-18 02:24:30'),
(31, 'Exploring Science on Campus', 'A campus scene showcasing science students engaged in learning and exploration, reflecting the academic environment, laboratory work, and curiosity that drive scientific discovery.', NULL, 'contributions/1773800916_IMG_6377-1200x900.jpg', 'contributions/covers/1773800916_cover_Screen-Shot-2017-11-24-at-10.07.22-AM.png', 'pending', 0, 1, 3, 6, 3, 21, '2026-03-18 02:28:36', '2026-03-18 02:28:36'),
(32, 'Expression Through Colors', 'An artistic photograph capturing the use of colors, textures, and composition to convey emotion and creativity. The image reflects the essence of visual art and personal expression.', NULL, 'contributions/1773803297_KaterynaKovarzh-1ba05508b85442b499a1ac2a9e324e8b.jpg', 'contributions/covers/1773803297_cover_1701589157539.jpg', 'selected', 1, 1, 3, 7, 4, 16, '2026-03-18 03:08:17', '2026-03-18 05:22:00'),
(33, 'Creativity in Action', 'Art students engaged in workshops and studio sessions, exploring techniques and collaborating on projects. The image reflects the vibrant learning environment and hands-on creative process on campus.', NULL, 'contributions/1773803770_Create-Art-Studio-Paint-Night-Workshop.jpeg', 'contributions/covers/1773803770_cover_Art-at-Faculty-Club2.jpg', 'selected', 1, 1, 3, 6, 4, 16, '2026-03-18 03:16:10', '2026-03-18 05:22:34'),
(34, 'The Silent Canvas', 'A blank canvas waits in quiet grace,\r\nInviting dreams to find their place.\r\nColors whisper, lines take flight,\r\nTurning silence into light.\r\n\r\nEvery stroke a story told,\r\nOf visions new and memories old.\r\nIn the world of art, we see and feel,\r\nThe boundless power that makes life real.', NULL, 'contributions/1773805906_The Silent Canvas.pdf', 'contributions/covers/1773805906_cover_19310440_silente-tample.jpg', 'commented', 0, 1, 3, 3, 4, 17, '2026-03-18 03:51:46', '2026-03-18 05:22:45'),
(35, 'The Street Art of Resistance', 'Examines historical development and social meaning of street art.', NULL, 'contributions/1773810220_The_Street_Art_of_Resistance.pdf', 'contributions/covers/1773810220_cover_gailatlarge-GEA_3149-680x1022.jpg', 'commented', 0, 1, 3, 3, 4, 31, '2026-03-18 05:03:40', '2026-03-18 05:22:55'),
(36, 'Integration of VR and AR in Art Creation and Education', 'Reviews how virtual/augmented reality expands artistic expression.', NULL, 'contributions/1773810602_CaC_2021_№1_Volynets.pdf', 'contributions/covers/1773810602_cover_February-AR-VR.png', 'pending', 0, 1, 3, 1, 4, 31, '2026-03-18 05:10:02', '2026-03-18 05:10:02'),
(37, 'Narrative and Storytelling in Visual Arts', 'Examines how visuals communicate narrative across different art forms.', NULL, 'contributions/1773811163_2046-4053-2-19.pdf', 'contributions/covers/1773811163_cover_163381-168097.jpg', 'pending', 0, 1, 3, 1, 4, 16, '2026-03-18 05:19:23', '2026-03-18 05:19:23'),
(38, 'TensorFlow: Large-Scale Machine Learning on Heterogeneous Distributed Systems', 'This paper introduces TensorFlow, a system designed for building and deploying large-scale machine learning models across various platforms, from mobile devices to distributed systems. It explains how TensorFlow supports complex algorithms such as deep neural networks and enables efficient computation in areas like artificial intelligence, computer vision, and data analysis.', 'Here are three clear and professional bullet points summarizing the university article on TensorFlow:\n\n* **Overview of TensorFlow**: TensorFlow is an open-source software library for large-scale machine learning on heterogeneous distributed systems, allowing computations to be executed on a wide range of devices, from mobile devices to large-scale distributed systems, with little to no change.\n* **Key Features and Components**: TensorFlow\'s programming model is based on a dataflow graph, which represents a computation as a graph of nodes and edges, and its implementation includes a client, master, and worker processes, as well as support for various devices, including CPUs and GPUs, and a range of operations, including element-wise mathematical operations, array operations, and neural network building blocks.\n* **Applications and Advantages**: TensorFlow has been used for research and production in a variety of areas, including computer vision, speech recognition, and natural language processing, and offers advantages such as flexibility, scalability, and high performance, making it suitable for both small-scale deployment on mobile devices and large-scale training on distributed systems, and its open-source release has made it widely accessible to the machine learning community.', 'contributions/1773826378_1603.04467v2.pdf', 'contributions/covers/1773826378_cover_entropy-24-01284-g008.png', 'selected', 1, 1, 3, 1, 5, 14, '2026-03-18 09:32:58', '2026-03-28 15:53:16'),
(39, '48-Hour Coding Hackathon', 'A dynamic hackathon event where computing students collaborate intensively to design and develop innovative software solutions within a limited time. The image captures teamwork, creativity, and problem-solving as participants work together to build functional prototypes. Hackathons are fast-paced events where teams create solutions in a short period, often focusing on real-world challenges.', NULL, 'contributions/1773826570_for hackathon blog post_1.jpg', 'contributions/covers/1773826570_cover_RTU_ditf_bilde_1920x1282.jpg', 'selected', 1, 1, 3, 8, 5, 14, '2026-03-18 09:36:10', '2026-03-18 10:27:20'),
(40, 'Coding Culture on Campus', 'A campus scene capturing computing students engaged in coding, collaboration, and project discussions. The image reflects the tech-driven learning environment and the spirit of innovation within the computing faculty.', NULL, 'contributions/1773827182_codecreate11-blog.jpg', 'contributions/covers/1773827182_cover_Citify-Kipsalas-iela-6-08.jpg', 'selected', 1, 1, 3, 6, 5, 15, '2026-03-18 09:46:22', '2026-03-18 10:27:35'),
(41, 'Student Contribution Management System', 'This project involves the development of a web-based system for managing student contributions, including articles, images, and research submissions. It features user registration and login, role-based access for students and administrators, and functions for uploading, reviewing, and managing content efficiently.', NULL, 'contributions/1773828707_THE_CONTRIBUTIONS_OF_E_SCHOOL_A_STUDENT.pdf', 'contributions/covers/1773828707_cover_responder-student-reporting-management-system.png', 'commented', 0, 1, 3, 2, 5, 15, '2026-03-18 10:11:47', '2026-03-18 10:27:45'),
(42, 'Code Sprint Hackathon', 'Participants collaborate in teams during a high-energy hackathon, brainstorming ideas and developing software solutions under time constraints. The image captures focus, innovation, and teamwork within the computing community.', NULL, 'contributions/1773829116_1760691604059.jpg', 'contributions/covers/1773829116_cover_images.jpg', 'pending', 0, 1, 3, 8, 5, 32, '2026-03-18 10:18:36', '2026-03-18 10:18:36'),
(43, 'A Review of Machine Learning Techniques in Modern Computing', 'This review examines various machine learning techniques, including supervised, unsupervised, and deep learning methods. It highlights their applications in areas such as data analysis, image recognition, and predictive modeling, while discussing current trends and challenges in modern computing.', NULL, 'contributions/1773829334_A_review_on_Machine_Learning_Techniques.pdf', 'contributions/covers/1773829334_cover_Research-&-Review-Machine-Learning-and-Cloud-Computing.jpg', 'commented', 0, 1, 3, 4, 5, 32, '2026-03-18 10:22:14', '2026-03-18 10:27:59');

-- --------------------------------------------------------

--
-- Table structure for table `faculty`
--

CREATE TABLE `faculty` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faculty`
--

INSERT INTO `faculty` (`id`, `name`, `description`, `is_public`, `created_at`, `updated_at`) VALUES
(1, 'Engineering', 'Engineering and technology related programs', 1, '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(2, 'Business', 'Business, management, and finance studies', 1, '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(3, 'Science', 'Pure and applied science programs', 1, '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(4, 'Arts', 'Arts, humanities, and social sciences', 1, '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(5, 'Computing', 'Computer science, IT, and software engineering', 1, '2026-03-14 15:05:56', '2026-03-14 15:05:56');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(191) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(191) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_02_03_070142_create_personal_access_tokens_table', 1),
(5, '2026_02_10_140707_create_roles_table', 1),
(6, '2026_02_10_140735_create_faculty_table', 1),
(7, '2026_02_10_141117_add_columns_to_users_table', 1),
(8, '2026_02_18_114426_create_academic_years_table', 1),
(9, '2026_02_18_114634_create_categories_table', 1),
(10, '2026_02_18_114708_create_contributions_table', 1),
(11, '2026_02_18_114900_create_comments_table', 1),
(12, '2026_02_24_064529_add_cover_photo_path_to_contributions_table', 1),
(13, '2026_02_25_034242_add_type_to_categories_table', 1),
(14, '2026_02_25_040136_add_profile_path_to_users_table', 1),
(15, '2026_03_07_143407_create_notifications_table', 1),
(16, '2026_03_07_144906_add_contribution_id_to_notifications_table', 1),
(17, '2026_03_07_145252_create_notifications_table', 1),
(18, '2026_03_18_141147_create_contact_us_table', 2),
(19, '2026_03_18_161814_add_last_login_to_users_table', 2),
(20, '2026_03_23_142104_add_browser_column_to_users_table', 3),
(21, '2026_03_23_154653_add_summary_to_contributions_table', 4),
(22, '2026_03_24_200741_add_2fa_columns_to_users_table', 4),
(23, '2026_03_24_203628_add_2fa_expiry_to_users_table', 4),
(24, '2026_03_27_000001_add_previous_login_at_to_users_table', 5),
(25, '2026_03_27_221041_create_page_views_table', 5);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `remind` tinyint(1) NOT NULL DEFAULT 0,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `contribution_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `name`, `description`, `remind`, `user_id`, `contribution_id`, `created_at`, `updated_at`) VALUES
(1, 'New Contribution Submitted', 'Khun has submitted a new contribution: \"Biocommondity Engineering\"', 0, 3, 1, '2026-03-14 15:44:32', '2026-03-14 15:44:32'),
(2, 'New Contribution Submitted', 'Nay Myo Aung has submitted a new contribution: \"Reliability engineering: Old problems and new challenges\"', 0, 3, 2, '2026-03-14 17:47:03', '2026-03-14 17:47:03'),
(3, 'New Contribution Submitted', 'Kaung Htut Paing has submitted a new contribution: \"An Overview of Soft Computing\"', 1, 7, 3, '2026-03-14 17:51:25', '2026-03-15 07:54:36'),
(4, 'New Contribution Submitted', 'Thuta has submitted a new contribution: \"Quantum computing\"', 1, 7, 4, '2026-03-14 17:54:11', '2026-03-15 08:22:17'),
(5, 'New Contribution Submitted', 'Htoo Arkar Lin has submitted a new contribution: \"The Art of Science\"', 0, 5, 5, '2026-03-14 17:59:02', '2026-03-14 17:59:02'),
(6, 'New Contribution Submitted', 'Thaung Naing Soe has submitted a new contribution: \"A new kind of science\"', 0, 5, 6, '2026-03-14 18:03:26', '2026-03-14 18:03:26'),
(7, 'New Contribution Submitted', 'Eaint Hmu Pyae has submitted a new contribution: \"The Theory of the Business\"', 0, 4, 7, '2026-03-14 18:19:14', '2026-03-14 18:19:14'),
(8, 'New Contribution Submitted', 'Zin Nwe Nwe Thein has submitted a new contribution: \"The economics of books\"', 0, 4, 8, '2026-03-14 18:25:01', '2026-03-14 18:25:01'),
(9, 'New Contribution Submitted', 'Htet Myat Lin has submitted a new contribution: \"Harmony of Light and Shadow\"', 0, 6, 9, '2026-03-14 18:29:17', '2026-03-14 18:29:17'),
(10, 'New Contribution Submitted', 'Aung Tayzar Phyo has submitted a new contribution: \"Life Around Campus\"', 0, 6, 10, '2026-03-14 18:32:14', '2026-03-14 18:32:14'),
(11, 'Contribution Selected', 'Congratulations! Your contribution \"Biocommondity Engineering\" has been selected.', 1, 13, 1, '2026-03-15 03:28:25', '2026-03-17 15:51:42'),
(12, 'Contribution Selected', 'Congratulations! Your contribution \"The Theory of the Business\" has been selected.', 0, 20, 7, '2026-03-15 03:47:43', '2026-03-15 03:47:43'),
(13, 'Contribution Selected', 'Congratulations! Your contribution \"The Art of Science\" has been selected.', 0, 18, 5, '2026-03-15 03:49:23', '2026-03-15 03:49:23'),
(14, 'Contribution Selected', 'Congratulations! Your contribution \"Life Around Campus\" has been selected.', 0, 17, 10, '2026-03-15 03:50:08', '2026-03-15 03:50:08'),
(15, 'Contribution Selected', 'Congratulations! Your contribution \"Quantum computing\" has been selected.', 0, 15, 4, '2026-03-15 03:51:00', '2026-03-15 03:51:00'),
(16, 'New Contribution Submitted', 'Smith Rowe has submitted a new contribution: \"Creative Ways of Knowing in Engineering\"', 0, 3, 11, '2026-03-17 15:05:54', '2026-03-17 15:05:54'),
(17, 'New Contribution Submitted', 'Max Downman has submitted a new contribution: \"Simple Circuit Experiment\"', 0, 3, 12, '2026-03-17 15:11:51', '2026-03-17 15:11:51'),
(18, 'New Contribution Submitted', 'Max Downman has submitted a new contribution: \"Gender Differences in Extracurricular Activities of Engineering Students\"', 0, 3, 13, '2026-03-17 15:19:26', '2026-03-17 15:19:26'),
(19, 'New Contribution Submitted', 'Ben White has submitted a new contribution: \"Engineering Innovation Showcase\"', 0, 3, 14, '2026-03-17 15:23:36', '2026-03-17 15:23:36'),
(20, 'New Contribution Submitted', 'Ben White has submitted a new contribution: \"Applications of Artificial Intelligence in Engineering\"', 0, 3, 15, '2026-03-17 15:33:23', '2026-03-17 15:33:23'),
(21, 'New Contribution Submitted', 'Aung Khant Paing has submitted a new contribution: \"The Evolution of Service Learning in Engineering Education\"', 0, 3, 16, '2026-03-17 15:39:30', '2026-03-17 15:39:30'),
(22, 'New Contribution Submitted', 'Khun has submitted a new contribution: \"Semantic Networks for Engineering Design\"', 0, 3, 17, '2026-03-17 15:50:41', '2026-03-17 15:50:41'),
(23, 'New Contribution Submitted', 'Khun has submitted a new contribution: \"Engineering Tech Expo 2026\"', 0, 3, 18, '2026-03-17 15:55:19', '2026-03-17 15:55:19'),
(24, 'Contribution Selected', 'Congratulations! Your contribution \"Reliability engineering: Old problems and new challenges\" has been selected.', 0, 23, 2, '2026-03-17 15:56:58', '2026-03-17 15:56:58'),
(25, 'Contribution Selected', 'Congratulations! Your contribution \"Creative Ways of Knowing in Engineering\" has been selected.', 0, 24, 11, '2026-03-17 15:58:52', '2026-03-17 15:58:52'),
(26, 'Contribution Selected', 'Congratulations! Your contribution \"Simple Circuit Experiment\" has been selected.', 0, 25, 12, '2026-03-17 16:05:22', '2026-03-17 16:05:22'),
(27, 'Contribution Selected', 'Congratulations! Your contribution \"Gender Differences in Extracurricular Activities of Engineering Students\" has been selected.', 0, 25, 13, '2026-03-17 16:18:39', '2026-03-17 16:18:39'),
(28, 'New Contribution Submitted', 'David Raya has submitted a new contribution: \"The Effects of Relationship Marketing on Share of Business – A Synthesis and Comparison of Models\"', 0, 4, 19, '2026-03-17 16:30:08', '2026-03-17 16:30:08'),
(29, 'New Contribution Submitted', 'David Raya has submitted a new contribution: \"A Comprehensive Literature Review in Competitive Advantages of Businesses\"', 0, 4, 20, '2026-03-17 16:34:52', '2026-03-17 16:34:52'),
(30, 'New Contribution Submitted', 'Eaint Hmu Pyae has submitted a new contribution: \"Business Students in Action\"', 0, 4, 21, '2026-03-17 16:40:04', '2026-03-17 16:40:04'),
(31, 'New Contribution Submitted', 'David Raya has submitted a new contribution: \"Packaging Design Comparison\"', 0, 4, 22, '2026-03-17 16:44:51', '2026-03-17 16:44:51'),
(32, 'Contribution Selected', 'Congratulations! Your contribution \"The economics of books\" has been selected.', 0, 19, 8, '2026-03-17 16:49:08', '2026-03-17 16:49:08'),
(33, 'Contribution Selected', 'Congratulations! Your contribution \"The Effects of Relationship Marketing on Share of Business – A Synthesis and Comparison of Models\" has been selected.', 0, 27, 19, '2026-03-17 16:50:28', '2026-03-17 16:50:28'),
(34, 'Contribution Selected', 'Congratulations! Your contribution \"A Comprehensive Literature Review in Competitive Advantages of Businesses\" has been selected.', 0, 27, 20, '2026-03-17 16:50:45', '2026-03-17 16:50:45'),
(35, 'New Contribution Submitted', 'Lewis Skelly has submitted a new contribution: \"NARRATIVE STRATEGIES\"', 0, 4, 23, '2026-03-17 17:12:04', '2026-03-17 17:12:04'),
(36, 'New Contribution Submitted', 'Zin Nwe Nwe Thein has submitted a new contribution: \"The Impact of Digital Marketing on Consumer Behavior\"', 0, 4, 24, '2026-03-18 01:44:46', '2026-03-18 01:44:46'),
(37, 'New Contribution Submitted', 'David Raya has submitted a new contribution: \"Business Seminar and Networking Event\"', 0, 4, 25, '2026-03-18 01:49:24', '2026-03-18 01:49:24'),
(38, 'New Contribution Submitted', 'Gabriel Jesus has submitted a new contribution: \"Examination of a Successful and Active Science Club\"', 0, 5, 26, '2026-03-18 02:00:14', '2026-03-18 02:00:14'),
(39, 'New Contribution Submitted', 'Gabriel Jesus has submitted a new contribution: \"Science Exhibition Day\"', 0, 5, 27, '2026-03-18 02:05:38', '2026-03-18 02:05:38'),
(40, 'New Contribution Submitted', 'Eberechi Eze has submitted a new contribution: \"APPLICATIONS OF BIOTECHNOLOGY IN AGRICULTURE\"', 0, 5, 28, '2026-03-18 02:13:40', '2026-03-18 02:13:40'),
(41, 'New Contribution Submitted', 'Eberechi Eze has submitted a new contribution: \"Water Purification Using Natural Filtration\"', 0, 5, 29, '2026-03-18 02:21:13', '2026-03-18 02:21:13'),
(42, 'New Contribution Submitted', 'Thaung Naing Soe has submitted a new contribution: \"Chemical Reaction Color Change\"', 0, 5, 30, '2026-03-18 02:24:31', '2026-03-18 02:24:31'),
(43, 'New Contribution Submitted', 'Thaung Naing Soe has submitted a new contribution: \"Exploring Science on Campus\"', 0, 5, 31, '2026-03-18 02:28:37', '2026-03-18 02:28:37'),
(44, 'Contribution Selected', 'Congratulations! Your contribution \"A new kind of science\" has been selected.', 0, 21, 6, '2026-03-18 02:43:44', '2026-03-18 02:43:44'),
(45, 'Contribution Selected', 'Congratulations! Your contribution \"Examination of a Successful and Active Science Club\" has been selected.', 0, 29, 26, '2026-03-18 03:00:27', '2026-03-18 03:00:27'),
(46, 'Contribution Selected', 'Congratulations! Your contribution \"Science Exhibition Day\" has been selected.', 0, 29, 27, '2026-03-18 03:00:42', '2026-03-18 03:00:42'),
(47, 'New Contribution Submitted', 'Htet Myat Lin has submitted a new contribution: \"Expression Through Colors\"', 0, 6, 32, '2026-03-18 03:08:17', '2026-03-18 03:08:17'),
(48, 'New Contribution Submitted', 'Htet Myat Lin has submitted a new contribution: \"Creativity in Action\"', 0, 6, 33, '2026-03-18 03:16:10', '2026-03-18 03:16:10'),
(49, 'New Contribution Submitted', 'Aung Tayzar Phyo has submitted a new contribution: \"The Silent Canvas\"', 0, 6, 34, '2026-03-18 03:51:46', '2026-03-18 03:51:46'),
(50, 'New Contribution Submitted', 'Martin Odegaard has submitted a new contribution: \"The Street Art of Resistance\"', 0, 6, 35, '2026-03-18 05:03:41', '2026-03-18 05:03:41'),
(51, 'New Contribution Submitted', 'Martin Odegaard has submitted a new contribution: \"Integration of VR and AR in Art Creation and Education\"', 0, 6, 36, '2026-03-18 05:10:03', '2026-03-18 05:10:03'),
(52, 'New Contribution Submitted', 'Htet Myat Lin has submitted a new contribution: \"Narrative and Storytelling in Visual Arts\"', 0, 6, 37, '2026-03-18 05:19:23', '2026-03-18 05:19:23'),
(53, 'Contribution Selected', 'Congratulations! Your contribution \"Harmony of Light and Shadow\" has been selected.', 0, 16, 9, '2026-03-18 05:21:48', '2026-03-18 05:21:48'),
(54, 'Contribution Selected', 'Congratulations! Your contribution \"Expression Through Colors\" has been selected.', 0, 16, 32, '2026-03-18 05:22:00', '2026-03-18 05:22:00'),
(55, 'Contribution Selected', 'Congratulations! Your contribution \"Creativity in Action\" has been selected.', 0, 16, 33, '2026-03-18 05:22:34', '2026-03-18 05:22:34'),
(56, 'New Contribution Submitted', 'Kaung Htut Paing has submitted a new contribution: \"TensorFlow: Large-Scale Machine Learning on Heterogeneous Distributed Systems\"', 0, 7, 38, '2026-03-18 09:32:58', '2026-03-18 09:32:58'),
(57, 'New Contribution Submitted', 'Kaung Htut Paing has submitted a new contribution: \"48-Hour Coding Hackathon\"', 0, 7, 39, '2026-03-18 09:36:10', '2026-03-18 09:36:10'),
(58, 'New Contribution Submitted', 'Thuta has submitted a new contribution: \"Coding Culture on Campus\"', 0, 7, 40, '2026-03-18 09:46:23', '2026-03-18 09:46:23'),
(59, 'New Contribution Submitted', 'Thuta has submitted a new contribution: \"Student Contribution Management System\"', 0, 7, 41, '2026-03-18 10:11:47', '2026-03-18 10:11:47'),
(60, 'New Contribution Submitted', 'Bukayo Saka has submitted a new contribution: \"Code Sprint Hackathon\"', 0, 7, 42, '2026-03-18 10:18:36', '2026-03-18 10:18:36'),
(61, 'New Contribution Submitted', 'Bukayo Saka has submitted a new contribution: \"A Review of Machine Learning Techniques in Modern Computing\"', 0, 7, 43, '2026-03-18 10:22:14', '2026-03-18 10:22:14'),
(62, 'Contribution Selected', 'Congratulations! Your contribution \"An Overview of Soft Computing\" has been selected.', 0, 14, 3, '2026-03-18 10:26:37', '2026-03-18 10:26:37'),
(63, 'Contribution Selected', 'Congratulations! Your contribution \"TensorFlow: Large-Scale Machine Learning on Heterogeneous Distributed Systems\" has been selected.', 0, 14, 38, '2026-03-18 10:27:07', '2026-03-18 10:27:07'),
(64, 'Contribution Selected', 'Congratulations! Your contribution \"48-Hour Coding Hackathon\" has been selected.', 0, 14, 39, '2026-03-18 10:27:20', '2026-03-18 10:27:20'),
(65, 'Contribution Selected', 'Congratulations! Your contribution \"Coding Culture on Campus\" has been selected.', 0, 15, 40, '2026-03-18 10:27:35', '2026-03-18 10:27:35'),
(66, 'Contribution Selected', 'Congratulations! Your contribution \"Engineering Innovation Showcase\" has been selected.', 0, 26, 14, '2026-03-21 16:04:07', '2026-03-21 16:04:07'),
(67, 'Contribution Selected', 'Congratulations! Your contribution \"Applications of Artificial Intelligence in Engineering\" has been selected.', 0, 26, 15, '2026-03-21 16:05:28', '2026-03-21 16:05:28'),
(68, 'Contribution Selected', 'Congratulations! Your contribution \"Engineering Tech Expo 2026\" has been selected.', 0, 13, 18, '2026-03-22 05:29:28', '2026-03-22 05:29:28'),
(69, 'Contribution Selected', 'Congratulations! Your contribution \"Semantic Networks for Engineering Design\" has been selected.', 0, 13, 17, '2026-03-22 05:29:47', '2026-03-22 05:29:47'),
(70, 'Contribution Selected', 'Congratulations! Your contribution \"The Evolution of Service Learning in Engineering Education\" has been selected.', 0, 22, 16, '2026-03-22 05:29:55', '2026-03-22 05:29:55');

-- --------------------------------------------------------

--
-- Table structure for table `page_views`
--

CREATE TABLE `page_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_name` varchar(191) NOT NULL,
  `views` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `page_views`
--

INSERT INTO `page_views` (`id`, `page_name`, `views`, `created_at`, `updated_at`) VALUES
(1, 'Home Page', 22, '2026-03-28 15:26:08', '2026-03-29 09:17:52'),
(2, 'Terms Page', 1, '2026-03-28 15:26:21', '2026-03-28 15:26:21'),
(3, 'About Page', 1, '2026-03-28 16:00:05', '2026-03-28 16:00:05'),
(4, 'Contact Page', 1, '2026-03-28 16:00:06', '2026-03-28 16:00:06');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(191) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(59, 'App\\Models\\User', 1, 'auth_token', '7c2777ed97c65a8028e635e0b54f55e5b80990660066b9a5d2c25f255ac2ac5f', '[\"*\"]', '2026-03-18 02:29:40', NULL, '2026-03-17 15:46:32', '2026-03-18 02:29:40'),
(80, 'App\\Models\\User', 1, 'auth_token', '4510f7bbb6426bacb84974ba3d988ed5df2687d133121e5820ee6f8dfa729626', '[\"*\"]', '2026-03-18 08:05:07', NULL, '2026-03-18 02:29:59', '2026-03-18 08:05:07'),
(116, 'App\\Models\\User', 1, 'auth_token', '5f1ff6904e92443e84fb837e7c01e890b9f9ea52275174e6ea891c99be5e128b', '[\"*\"]', '2026-03-21 17:09:43', NULL, '2026-03-21 17:06:18', '2026-03-21 17:09:43'),
(135, 'App\\Models\\User', 14, 'auth_token', '17af36535c4a995a213a3d9fb1a6aae8e043391ee22d83b4a85e9ae005ae2996', '[\"*\"]', '2026-03-28 16:12:39', NULL, '2026-03-28 15:34:29', '2026-03-28 16:12:39'),
(144, 'App\\Models\\User', 1, 'auth_token', '069faba72240b9b2f893d3d291fdb2a172c2754cc69e7619190a993119acf79c', '[\"*\"]', '2026-03-29 07:31:37', NULL, '2026-03-28 16:04:16', '2026-03-29 07:31:37'),
(145, 'App\\Models\\User', 8, 'auth_token', 'f1908f5a51ec72063dd8e701f56a5fdeec1f098a1abc507d1b1036791e2fdff2', '[\"*\"]', '2026-03-29 07:35:20', NULL, '2026-03-28 16:12:46', '2026-03-29 07:35:20'),
(148, 'App\\Models\\User', 39, 'auth_token', '9d9eefde22e3f98e2f98ebbdd198b8ce8aba4b8058796ff3534aa0c6752f23f1', '[\"*\"]', '2026-03-29 09:18:49', NULL, '2026-03-29 09:18:41', '2026-03-29 09:18:49');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'student', 'Student user with standard access', '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(2, 'admin', 'Administrator with full system access', '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(3, 'guest', 'Guest user with limited access', '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(4, 'marketing_manager', 'Marketing Manager with approval and oversight permissions', '2026-03-14 15:05:56', '2026-03-14 15:05:56'),
(5, 'marketing_coordinator', 'Marketing Coordinator responsible for content and submissions', '2026-03-14 15:05:56', '2026-03-14 15:05:56');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(191) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('81AobfPKyWE6nYT2sZpaFlOrcPTVfFQGJ5IGf3Hx', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoickJqcUx4TjVkRE5NVmxTOTRGMzJ0bkxjb1N1Vll0SnRqbUVYMnc0SCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvZmFjdWx0aWVzIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1774839113),
('8RuuirYTPUexoHL38TddlT5gDEb3k8eS9cCNdeGf', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUUQzb1R5TjRiQm5rQ2M2Rnc3RjZPd0FnV1RQVUcxUGdLQzhzVkNuVSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9hcGkvdXNlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1774839782);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) NOT NULL,
  `is_2fa_on` tinyint(1) NOT NULL DEFAULT 0,
  `verification_code` varchar(191) DEFAULT NULL,
  `verification_expires_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `previous_login_at` timestamp NULL DEFAULT NULL,
  `is_new_user` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `faculty_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('active','inactive','suspended') NOT NULL DEFAULT 'active',
  `profile_path` varchar(191) DEFAULT NULL,
  `browser` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `is_2fa_on`, `verification_code`, `verification_expires_at`, `remember_token`, `last_login_at`, `previous_login_at`, `is_new_user`, `created_at`, `updated_at`, `role_id`, `faculty_id`, `status`, `profile_path`, `browser`) VALUES
(1, 'Admin', 'admin@university.edu', '2026-03-14 15:05:56', '$2y$12$kzeD7xf86V.LqEIzmJ48ke6gWLy2xcxqnvF41DSqrzRqIqsnoHzAO', 0, NULL, NULL, NULL, '2026-03-28 16:04:16', '2026-03-28 16:00:50', 0, '2026-03-14 15:05:56', '2026-03-28 16:04:16', 2, 1, 'active', NULL, 'Chrome'),
(2, 'Marketing Manager', 'manager@university.edu', '2026-03-14 15:05:56', '$2y$12$mHBsBLanUG8Yv5xeECMonOqeL6l6KPlkenDysHcmJ1VLq1ukxREvK', 0, NULL, NULL, NULL, '2026-03-25 09:15:13', NULL, 0, '2026-03-14 15:05:56', '2026-03-25 09:15:13', 4, NULL, 'active', NULL, 'Safari'),
(3, 'Marketing Coordinator1', 'coordinator1@university.edu', '2026-03-14 15:05:56', '$2y$12$yOQH7VDd66ETQBLx6rmoUu3yPFTPtFyDl//5PAm4wS4/XRUlgd7yy', 0, NULL, NULL, NULL, '2026-03-28 15:41:52', '2026-03-22 05:28:44', 0, '2026-03-14 15:05:56', '2026-03-28 15:41:52', 5, 1, 'active', NULL, 'Chrome'),
(4, 'Marketing Coordinator2', 'coordinator2@university.edu', '2026-03-14 15:05:57', '$2y$12$MQsfTIwUCE1eKoAlgeBofeAkGp3tI8B.6Mr3kshS/wtX65m4A1aIa', 0, NULL, NULL, NULL, '2026-03-23 12:40:15', NULL, 0, '2026-03-14 15:05:57', '2026-03-23 12:40:15', 5, 2, 'active', NULL, 'Safari'),
(5, 'Marketing Coordinator3', 'coordinator3@university.edu', '2026-03-14 15:05:57', '$2y$12$zDj8Vo26mcQQENlEsWh6SesIFbeyLeSiFcsQCf2PWZbpBfhuHcD4G', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:05:57', '2026-03-14 15:05:57', 5, 3, 'active', NULL, NULL),
(6, 'Marketing Coordinator4', 'coordinator4@university.edu', '2026-03-14 15:05:57', '$2y$12$qAeiQnGfjaoxUQE.8fFptOMI250lrRlD2GhJBBBwZFt4E2hEZ3TNK', 0, NULL, NULL, NULL, '2026-03-20 03:28:10', NULL, 0, '2026-03-14 15:05:57', '2026-03-20 03:28:10', 5, 4, 'active', NULL, NULL),
(7, 'Marketing Coordinator5', 'coordinator5@university.edu', '2026-03-14 15:05:57', '$2y$12$V.tGuylFJNFI.vFRKn5lZuXcgGg51yKySoatHCllsL5hj6HGWSsyu', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:05:57', '2026-03-14 15:05:57', 5, 5, 'active', NULL, NULL),
(8, 'Guest1', 'guest1@university.edu', '2026-03-14 15:05:57', '$2y$12$cnMdDQgOVBYqgoqfIZCBm.dzPubHYb137pCh4crsTWr2uGbzmYt8q', 0, NULL, NULL, NULL, '2026-03-28 16:12:46', '2026-03-25 09:05:59', 0, '2026-03-14 15:05:57', '2026-03-28 16:12:46', 3, 1, 'active', NULL, 'Safari'),
(9, 'Guest2', 'guest2@university.edu', '2026-03-14 15:05:58', '$2y$12$X.14ln5L1jufgQcxEuyXSuY6797M7qRLR7x7uA9ttQhnr6MvdweaC', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:05:58', '2026-03-14 15:05:58', 3, 2, 'active', NULL, NULL),
(10, 'Guest3', 'guest3@university.edu', '2026-03-14 15:05:58', '$2y$12$pvTjjX3BhqrkwcmJle.eKOZMmrYe0nmz2WYnNtxBJ7ZDCEaCwuaAu', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:05:58', '2026-03-14 15:05:58', 3, 3, 'active', NULL, NULL),
(11, 'Guest4', 'guest4@university.edu', '2026-03-14 15:05:58', '$2y$12$SzA1gKolGauAwDifWUHLJeZFyYiR9PutOxK1pdPTUdpbxU66H9veK', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:05:58', '2026-03-14 15:05:58', 3, 4, 'active', NULL, NULL),
(12, 'Guest5', 'guest5@university.edu', '2026-03-14 15:05:58', '$2y$12$zJwh1PXvEQBDLQtYGkqIz.oosttaZkf5dqkJ1aziy1u1KAIAAaNKK', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:05:58', '2026-03-14 15:05:58', 3, 5, 'active', NULL, NULL),
(13, 'Khun', 'khun@university.edu', NULL, '$2y$12$RNBO0bhO7jSEB1XyIWvvH.HdxpEXIIERMMDb9AAY678oUFdqU1iDK', 0, NULL, NULL, NULL, '2026-03-28 15:55:37', '2026-03-21 16:23:22', 0, '2026-03-14 15:11:56', '2026-03-28 15:55:37', 1, 1, 'active', 'profiles/1773762689_profile_13.jpg', 'Chrome'),
(14, 'Kaung Htut Paing', 'kaunghtutp@gmail.com', NULL, '$2y$12$7L1x3GNxk1NptWlOrwhrq.vkIqE19c0iw5Bc1.HaKc8OU70h5Eig2', 0, NULL, NULL, NULL, '2026-03-29 09:14:10', '2026-03-29 07:31:41', 0, '2026-03-14 15:29:39', '2026-03-29 09:14:10', 1, 5, 'active', 'profiles/1773547094_profile_14.jpg', 'Chrome'),
(15, 'Thuta', 'thuta@university.edu', NULL, '$2y$12$LlXkQB57qmrKR7mhrNUYTuQOX6v/hNk3ZtWKdyWAbH4z2SeEI1COG', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:31:04', '2026-03-15 04:01:13', 1, 5, 'active', 'profiles/1773547273_profile_15.jpg', NULL),
(16, 'Htet Myat Lin', 'hml@university.edu', NULL, '$2y$12$zW6QK68clgCgMst/maeaAeA48TQwrA6xyrzgk7v5L4eVsukfxVJX.', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:31:47', '2026-03-14 15:31:47', 1, 4, 'active', NULL, NULL),
(17, 'Aung Tayzar Phyo', 'atp@university.edu', NULL, '$2y$12$u0sEybqzUDtFjWs.Iq3k0.dWP1w5mHrdAjHC0XTS9.pVX2mFsmc9a', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:32:31', '2026-03-14 15:32:31', 1, 4, 'active', NULL, NULL),
(18, 'Htoo Arkar Lin', 'hal@university.edu', NULL, '$2y$12$hZ2F74mVHiNFNM.E1.dEPusjIgV5ZA1H3Ca7x1932o4lg1TODcoOu', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:33:13', '2026-03-14 15:33:13', 1, 3, 'active', NULL, NULL),
(19, 'Zin Nwe Nwe Thein', 'znnt@university.edu', NULL, '$2y$12$EiqPbR1pMFLHTLk2sTzlputCEYArTEIZO0qHGU8lJo.SjKvtovgPW', 0, NULL, NULL, NULL, '2026-03-22 05:04:15', NULL, 0, '2026-03-14 15:34:08', '2026-03-22 05:04:15', 1, 2, 'active', NULL, NULL),
(20, 'Eaint Hmu Pyae', 'ehp@university.edu', NULL, '$2y$12$Ph2OY92LJJ2rdeDwbD9YS.9rxq37RWLicVMqSkL/eSbZwkPcS1szi', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:35:09', '2026-03-14 15:35:09', 1, 2, 'active', NULL, NULL),
(21, 'Thaung Naing Soe', 'tns@university.edu', NULL, '$2y$12$KLDaxemcOlRW2HKC7M0AOuoMschGwYSyV70JoD6fNirBSCLzFRziq', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:36:38', '2026-03-14 15:36:38', 1, 3, 'active', NULL, NULL),
(22, 'Aung Khant Paing', 'akp@university.edu', NULL, '$2y$12$UVEgMaX5a8EP2yM0YaMWWesB3krlSyqKsN/gPWjRSlvb4RyT3esNy', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:37:33', '2026-03-14 15:37:33', 1, 1, 'active', NULL, NULL),
(23, 'Nay Myo Aung', 'nma@university.edu', NULL, '$2y$12$Qn/xexgfWez9W6tR/lr/h.pyZjsgsu..eHTvD2nVaTaCO78PDpn0W', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-14 15:38:07', '2026-03-14 15:38:07', 1, 1, 'active', NULL, NULL),
(24, 'Smith Rowe', 'smith@university.edu', NULL, '$2y$12$MFR9mqdfcZpB7f9loG5bSeNhTFnufiAMnZNqlxWSXhCoReV/zPCPa', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-17 14:59:29', '2026-03-17 14:59:29', 1, 1, 'active', NULL, NULL),
(25, 'Max Downman', 'max@university.edu', NULL, '$2y$12$2HgrnKtzCNa02lYyCNbBCuJAPJcRVnivxDSAFbR8OJe7aogsW6E3K', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-17 15:06:58', '2026-03-17 15:06:58', 1, 1, 'active', NULL, NULL),
(26, 'Ben White', 'ben@university.edu', NULL, '$2y$12$DP8fzOAJz7.YfQhq9On0POmi0699Yxd4PfQwz7XCAeqYpuYQc03mK', 0, NULL, NULL, NULL, '2026-03-20 16:39:16', NULL, 0, '2026-03-17 15:20:17', '2026-03-20 16:39:16', 1, 1, 'active', NULL, NULL),
(27, 'David Raya', 'raya@university.edu', NULL, '$2y$12$hgQWUEC15IdVHg0UNu0PxurZNZwZ1A6VZQILwoR6gTWGN5pWGw3cq', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-17 16:23:14', '2026-03-17 16:46:33', 1, 2, 'active', 'profiles/1773765993_profile_27.jpg', NULL),
(28, 'Lewis Skelly', 'lewis@university.edu', NULL, '$2y$12$KInX5DGHY2JcMJZTix5G3uI7ombscGpZqqNM7I5fS09C2VV7d2F2a', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-17 16:52:37', '2026-03-17 16:52:37', 1, 2, 'active', NULL, NULL),
(29, 'Gabriel Jesus', 'jesus@university.edu', NULL, '$2y$12$79JNUAWzM/W2FvPNteU3x.cTPx/ao7utmSZhS/vbqov7zgXw6KflO', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-18 01:53:32', '2026-03-18 01:53:32', 1, 3, 'active', NULL, NULL),
(30, 'Eberechi Eze', 'eze@universirty.edu', NULL, '$2y$12$J/3HQ..PWtSIB7D3fQ1aLOfpuWynS46MwwTGXvT6lZe8657MJyVVG', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-18 02:06:36', '2026-03-18 02:07:45', 1, 3, 'active', 'profiles/1773799664_profile_30.jpg', NULL),
(31, 'Martin Odegaard', 'martin@university.edu', NULL, '$2y$12$VJdE0Ex/RyWeBnRjF5.8Sez913rpE0lP5HNWOCknZ/oPlkgSXX9Ga', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-18 03:53:01', '2026-03-18 03:53:01', 1, 4, 'active', NULL, NULL),
(32, 'Bukayo Saka', 'saka@university.edu', NULL, '$2y$12$Ue8hwI5t.3u8INVenhJzU.kHN0DPfnzGrQpuC6HHgnjdpWcipOfZu', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-18 10:14:23', '2026-03-18 10:14:23', 1, 5, 'active', NULL, NULL),
(33, 'Declan Rice', 'rice@university.edu', NULL, '$2y$12$SQBGoTYPZ7kUoNd6I.f9MuxUlbQCgtuhKRbC.H5Ve4Q0ToGhDX2QC', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-18 10:22:58', '2026-03-18 10:22:58', 1, 5, 'active', NULL, NULL),
(34, 'Viktor Gyokeres', 'viktor@university.edu', NULL, '$2y$12$HXl2LE547nKU4O6CNvv1t.CEV4G6IJOBb6MIoo66Tjmcjhdiz0GGC', 0, NULL, NULL, NULL, NULL, NULL, 1, '2026-03-18 10:23:50', '2026-03-18 10:23:50', 1, 5, 'active', NULL, NULL),
(35, 'Kai Havertz', 'kai@university.edu', NULL, '$2y$12$jKmjaZAAGOMJW9HcUxd.Luqn6kWAMeWwtzXPYe77mIOsDSF8HrjFK', 0, NULL, NULL, NULL, '2026-03-20 02:40:31', NULL, 0, '2026-03-20 02:38:45', '2026-03-20 02:40:31', 1, 5, 'active', NULL, NULL),
(36, 'Lamine Yamal', 'yamal@gmail.com', NULL, '$2y$12$P30QgAFHAronDkBSUlrVLubhr.KYNdOM.VTk9qxqouIdDnBfQ0aSi', 0, NULL, NULL, NULL, '2026-03-20 09:37:30', NULL, 0, '2026-03-20 03:27:01', '2026-03-20 09:37:30', 3, 4, 'active', NULL, NULL),
(38, 'Harry', 'harry@gmail.com', NULL, '$2y$12$.mUoBjRbDgjIC/1.Ff3hlOrvLZiPRMKEKEl4A/QeEn4wGkcY0j9oi', 0, NULL, NULL, NULL, NULL, NULL, 0, '2026-03-28 16:01:37', '2026-03-28 16:02:18', 3, 1, 'active', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comments_parent_id_foreign` (`parent_id`),
  ADD KEY `comments_contribution_id_foreign` (`contribution_id`),
  ADD KEY `comments_user_id_foreign` (`user_id`);

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contributions`
--
ALTER TABLE `contributions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contributions_academic_year_id_foreign` (`academic_year_id`),
  ADD KEY `contributions_category_id_foreign` (`category_id`),
  ADD KEY `contributions_faculty_id_foreign` (`faculty_id`),
  ADD KEY `contributions_user_id_foreign` (`user_id`);

--
-- Indexes for table `faculty`
--
ALTER TABLE `faculty`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`),
  ADD KEY `notifications_contribution_id_foreign` (`contribution_id`);

--
-- Indexes for table `page_views`
--
ALTER TABLE `page_views`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_role_id_index` (`role_id`),
  ADD KEY `users_faculty_id_index` (`faculty_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `academic_years`
--
ALTER TABLE `academic_years`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contributions`
--
ALTER TABLE `contributions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `faculty`
--
ALTER TABLE `faculty`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `page_views`
--
ALTER TABLE `page_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=149;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_contribution_id_foreign` FOREIGN KEY (`contribution_id`) REFERENCES `contributions` (`id`),
  ADD CONSTRAINT `comments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `contributions`
--
ALTER TABLE `contributions`
  ADD CONSTRAINT `contributions_academic_year_id_foreign` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`),
  ADD CONSTRAINT `contributions_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `contributions_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`),
  ADD CONSTRAINT `contributions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_contribution_id_foreign` FOREIGN KEY (`contribution_id`) REFERENCES `contributions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_faculty_id_foreign` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
