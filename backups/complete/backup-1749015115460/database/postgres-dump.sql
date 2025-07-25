--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_requests; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.access_requests (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    unit_number character varying(50) NOT NULL,
    mobile character varying(20),
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.access_requests OWNER TO neondb_owner;

--
-- Name: access_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.access_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.access_requests_id_seq OWNER TO neondb_owner;

--
-- Name: access_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.access_requests_id_seq OWNED BY public.access_requests.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    applicant_name character varying(255) NOT NULL,
    applicant_email character varying(255) NOT NULL,
    applicant_phone character varying(50) NOT NULL,
    cover_letter text,
    cv_file_name character varying(255),
    cv_file_path character varying(500),
    job_id integer,
    internship_id integer,
    status character varying(50) DEFAULT 'submitted'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.applications OWNER TO neondb_owner;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO neondb_owner;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: community_benefits; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.community_benefits (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    discount_percentage character varying(50),
    business_name character varying(255) NOT NULL,
    location character varying(500),
    image_url character varying(1000),
    valid_until character varying(255),
    category character varying(100),
    is_active boolean DEFAULT true,
    show_on_homepage boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    image_urls text[]
);


ALTER TABLE public.community_benefits OWNER TO neondb_owner;

--
-- Name: community_benefits_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.community_benefits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_benefits_id_seq OWNER TO neondb_owner;

--
-- Name: community_benefits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.community_benefits_id_seq OWNED BY public.community_benefits.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.courses (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    type character varying(50) NOT NULL,
    instructor character varying(255),
    duration character varying(100),
    price character varying(50),
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    max_attendees integer,
    current_attendees integer DEFAULT 0,
    location character varying(255),
    is_online boolean DEFAULT false,
    registration_url character varying(500),
    skills text,
    is_active boolean DEFAULT true,
    is_featured boolean DEFAULT false,
    posted_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_approved boolean DEFAULT false
);


ALTER TABLE public.courses OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO neondb_owner;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: cv_showcase; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.cv_showcase (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    title character varying(255) NOT NULL,
    section character varying(100) NOT NULL,
    bio text,
    skills text,
    experience text,
    education text,
    years_of_experience character varying(50),
    cv_file_name character varying(255),
    cv_file_path character varying(500),
    linkedin_url character varying(500),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cv_showcase OWNER TO neondb_owner;

--
-- Name: cv_showcase_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.cv_showcase_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cv_showcase_id_seq OWNER TO neondb_owner;

--
-- Name: cv_showcase_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.cv_showcase_id_seq OWNED BY public.cv_showcase.id;


--
-- Name: email_whitelist; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.email_whitelist (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255),
    unit character varying(100),
    phone character varying(50),
    is_active boolean DEFAULT true,
    added_by character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.email_whitelist OWNER TO neondb_owner;

--
-- Name: email_whitelist_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.email_whitelist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.email_whitelist_id_seq OWNER TO neondb_owner;

--
-- Name: email_whitelist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.email_whitelist_id_seq OWNED BY public.email_whitelist.id;


--
-- Name: internships; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.internships (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    description text NOT NULL,
    requirements text,
    skills text,
    department character varying(100),
    duration character varying(50),
    is_paid boolean DEFAULT false,
    stipend character varying(100),
    location character varying(255),
    positions integer DEFAULT 1,
    is_active boolean DEFAULT true,
    posted_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_approved boolean DEFAULT false
);


ALTER TABLE public.internships OWNER TO neondb_owner;

--
-- Name: internships_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.internships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internships_id_seq OWNER TO neondb_owner;

--
-- Name: internships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.internships_id_seq OWNED BY public.internships.id;


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    description text NOT NULL,
    requirements text,
    skills text,
    industry character varying(100),
    experience_level character varying(50),
    job_type character varying(50),
    location character varying(255),
    salary_range character varying(100),
    is_active boolean DEFAULT true,
    posted_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_approved boolean DEFAULT false,
    status character varying(20) DEFAULT 'pending'::character varying,
    contact_email character varying(255) DEFAULT 'contact@company.com'::character varying NOT NULL,
    contact_phone character varying(50) DEFAULT 'TBD'::character varying NOT NULL,
    poster_email character varying(255),
    poster_role character varying(100) DEFAULT 'Staff'::character varying NOT NULL
);


ALTER TABLE public.jobs OWNER TO neondb_owner;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO neondb_owner;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    user_id integer,
    name character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    company character varying(255),
    bio text,
    skills text,
    industry character varying(100),
    experience_level character varying(50),
    contact character varying(255),
    linkedin_url character varying(500),
    portfolio_url character varying(500),
    is_visible boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    phone character varying(20),
    how_can_you_support text,
    cv_file_name character varying(500),
    cv_file_path character varying(500)
);


ALTER TABLE public.profiles OWNER TO neondb_owner;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profiles_id_seq OWNER TO neondb_owner;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    last_login_at timestamp without time zone
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: access_requests id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.access_requests ALTER COLUMN id SET DEFAULT nextval('public.access_requests_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: community_benefits id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.community_benefits ALTER COLUMN id SET DEFAULT nextval('public.community_benefits_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: cv_showcase id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cv_showcase ALTER COLUMN id SET DEFAULT nextval('public.cv_showcase_id_seq'::regclass);


--
-- Name: email_whitelist id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_whitelist ALTER COLUMN id SET DEFAULT nextval('public.email_whitelist_id_seq'::regclass);


--
-- Name: internships id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.internships ALTER COLUMN id SET DEFAULT nextval('public.internships_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: access_requests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.access_requests (id, full_name, email, unit_number, mobile, status, created_at, updated_at) FROM stdin;
3	Mohamed Yassin	mohamed.yassein1988@gmail.com	C336	+201096899444	rejected	2025-05-28 06:06:31.939276	2025-05-28 06:16:41.002
2	Mohamed Yassin	mohamed.yassein1988@gmail.com	C336	+201096899444	approved	2025-05-28 05:38:49.087459	2025-05-28 06:48:23.731
1	mohamed yassin	mohamed.yassein1988@gmail.com	C336	+201096899444	rejected	2025-05-28 05:35:59.404418	2025-05-28 07:14:22.354
5	Nouran Elgemei	nouranncw@gmail.com	Carnell A7 24 	\N	approved	2025-05-28 08:15:18.443496	2025-05-28 08:17:06.891
4	Nouran Elgemei	nouranncw@gmail.com	Carnell A7 	01001119010	rejected	2025-05-28 08:11:58.247611	2025-05-28 08:17:33.653
6	Sara Abdallah	sara.m.abdullah@gmail.com	W12-22	+201000200782	approved	2025-05-28 13:04:05.884262	2025-05-28 13:04:20.824
7	hagar walid 	hagaratif9@gmail.com	34A Ambervilll 	01094047268	approved	2025-05-28 17:55:24.920519	2025-05-28 17:56:04.186
8	Shady Allam	shadyallam20@gmail.com	A7 apartement 6	+201003223027	approved	2025-05-28 18:01:46.628281	2025-05-28 18:02:14.978
9	Dina Ali	dyna.elgamal94@gmail.com	C3-36	+201022225178	approved	2025-05-29 06:27:35.940418	2025-05-29 06:29:44.21
10	Test User	test@gmail.com	C222	010222222222	rejected	2025-05-31 07:30:14.988052	2025-05-31 14:27:21.338
11	A Karim Abbassi	k.abbassi@medmark.eg	Villa 21 (ex 69) district 1	01002170200	approved	2025-05-31 14:35:20.979484	2025-05-31 14:40:36.017
13	Aly Mokhtar	aly.mokhtar@newgiza.com	AV-22B-P1	01000980093	approved	2025-05-31 14:42:02.638679	2025-05-31 14:48:33.563
12	Aly Mokhtar	aly.mokhtar@newgiza.com	AV22B-P1	01000980093	rejected	2025-05-31 14:41:15.378146	2025-05-31 14:59:32.739
14	Khaled Kassem 	khaledkassem1987@gmail.com	District 1 - Cliff 50A 	01002333998	approved	2025-05-31 14:52:12.67093	2025-05-31 14:59:38.919
17	Mahmoud Khalifa 	mkhalifa88@gmail.com	B1-11	01223456592	approved	2025-05-31 15:11:37.973601	2025-05-31 15:14:16.703
16	Amr Zaki	amrzak55@hitmail.com	RW9 -383	01222375676	approved	2025-05-31 15:10:21.830045	2025-05-31 15:14:19.09
15	Rania Abdel Ghaffar	raniaham@gmail.com	Building 25A, apartment G2	01028118112	approved	2025-05-31 14:59:47.05574	2025-05-31 15:14:21.378
18	PASSANT ELGAMAL	passant.elgamal@gmail.com	E402	+201229949227	approved	2025-05-31 15:18:11.179986	2025-05-31 15:26:44.586
19	Nadine Salah Shafik	nadineshafik@gmail.com	Av-33b-23	\N	approved	2025-05-31 15:26:09.12049	2025-05-31 15:26:49.295
20	Heba Safwat	safwathebs@gmail.com	Building E 3  Appt 4	01225000055	approved	2025-05-31 16:19:49.70779	2025-05-31 16:30:09.962
21	Mahmoud Mohammed Ghorab	ghorabmmm@gmail.com	Westridge, W-32-01	+201115667777	approved	2025-05-31 19:01:33.175651	2025-05-31 19:06:52.589
22	Salma Abousenna 	salma.abousenna@aucegypt.edu	J934 	01221694965	approved	2025-06-01 04:00:38.758358	2025-06-01 04:04:54.221
24	Sohaila maged el sanadily	sohaila.maged@gmail.com	Ivoryhill 1 , TH9	01222384560	approved	2025-06-01 05:15:44.772172	2025-06-01 05:17:58.887
23	Iman Issawy	iman2211@hotmail.com	Jasperwood j11-06	\N	approved	2025-06-01 05:14:49.842939	2025-06-01 05:18:02.016
25	Nihal zaki	nannouzaki@yahoo.com	RB-03B-03	+201277671228	approved	2025-06-01 06:44:38.732729	2025-06-01 07:25:36.077
26	Rana Serag ElDin	rana.serageldin@gmail.com	TV233 kings range	01006679311	approved	2025-06-01 09:08:22.772583	2025-06-01 09:42:02.196
27	Mokhtar Elzorkany	mzorkany@efg-hermes.com	34a p4 amberville 	01111319000	approved	2025-06-01 10:33:15.358691	2025-06-01 10:38:21.003
28	Fatma Atteya Elemam 	fatmaelemam@hotmail.com	Fairway 47- district one 	01033667400	approved	2025-06-01 12:48:53.263327	2025-06-01 12:54:31.872
29	Ahmed Abdelgawad	ahmed.abdelgawad@adsero.me	T 95	01068827285	approved	2025-06-01 13:18:41.082134	2025-06-01 13:21:00.868
33	Mohamed shawky	mohamedshawkypg@gmail.com	Westridge 76	+201223100337	approved	2025-06-01 17:06:32.002933	2025-06-01 17:09:02.908
32	Aly M Shalaby	amshalaby52@gmail.com	E401	+201005339533	approved	2025-06-01 16:56:53.724625	2025-06-01 17:09:05.675
31	Omar Ebeid	omar.ebeid@gmail.com	Kingsrange TV7-200	01001278033	approved	2025-06-01 16:56:35.441656	2025-06-01 17:09:07.967
30	Karim Zebda	k.zebda@gmail.com	NH7 - 38B  - G3	\N	approved	2025-06-01 16:14:04.329709	2025-06-01 17:09:10.528
34	Seif Omar El Sallami	sallamiss26@hotmail.com	Amberville-35B-22	01005011991	approved	2025-06-01 17:58:05.999361	2025-06-01 17:59:35.945
35	Mohamed Ahmed Mahmoud	mohamedraghdan.mr@gmail.com	AV2A, G2, Phase 1	+201122283300	approved	2025-06-01 18:29:58.990151	2025-06-01 18:40:03.482
37	walid Mohamed Atef 	walid.atif@gmail.com	34A apartment 14	00201000333620	approved	2025-06-01 19:49:55.351937	2025-06-01 19:55:05.635
36	Malak El Kilany	malakelkilany@gmail.com	F6-11 Carnel	010908034	approved	2025-06-01 19:46:42.40722	2025-06-01 19:55:09.178
38	Pacint Moez	pmoez2005@yahoo.com	Jasperwood 222	01222493888	approved	2025-06-02 03:24:10.743531	2025-06-02 04:06:59.861
39	Rashad Aldemerdash	rashad67@yahoo.com	GS-GF 213 R KING'S RANGE	01000944422	approved	2025-06-02 06:05:35.136815	2025-06-02 06:13:11.746
40	Mohamad Mounir	mohamed.mounir@pinnacleltd.org	AV 27A 21	1200777776	approved	2025-06-02 06:42:45.921376	2025-06-02 06:44:13.011
42	Aya El Kady	elkady.aya@gmail.com	Westridge Rt 164	01099987789	approved	2025-06-02 07:30:16.718728	2025-06-02 07:36:08.857
41	eman elsaied	emansaiedmahmoud@gmail.com	J8-22 	+201270575590	approved	2025-06-02 06:52:34.655259	2025-06-02 07:36:11.482
44	Abdelaziz ELGAMAL 	zelgamal@gmail.com	J631	01060108057	approved	2025-06-02 14:34:19.103217	2025-06-02 14:53:08.564
43	Aya AbdulMoez	drayaabdulmoez@gmail.com	villa rw34	01116111334	approved	2025-06-02 14:32:43.831787	2025-06-02 14:53:21.274
49	Maryam Walid	maryamwalid20@gmail.com	34A , 14	+201002474216	approved	2025-06-02 17:40:45.488644	2025-06-02 17:47:40.196
48	Mohamed Hussein Eletreby 	m.etreby83@gmail.com	Neighborhood 2 townhouse 46	01066810076	approved	2025-06-02 17:38:21.273233	2025-06-02 17:56:46.703
47	Basma Nazif	basmanazif@gmail.com	W-10-21	+201003716331	approved	2025-06-02 16:26:35.375234	2025-06-02 17:57:38.38
46	Alia Mebed 	aliamebed@gmail.com	B2 22	01118729091	approved	2025-06-02 15:39:18.137912	2025-06-02 17:59:19.706
45	Mohamed Salah	mo.salaheldine@gmail.com	Av6b/p3	01223303862	approved	2025-06-02 15:19:03.628284	2025-06-02 17:59:30.196
50	Amr Zaki	amrzak55@hotmail.com	RW 9-383	01222375676	approved	2025-06-02 18:58:10.541197	2025-06-02 19:04:20.723
51	Amna El-Tayeb	amnaeltayeb16@hotmail.com	3B - G4	+201067880375	approved	2025-06-02 23:15:33.297974	2025-06-03 03:34:37.663
52	Jana Ahmed Mahdy	janamahdy63@gmail.com	Carnell	01212465111	approved	2025-06-03 16:21:43.412649	2025-06-03 16:24:24.521
53	Sara Kholeif	skholeif@gmail.com	AV 13b- 21	01223275566	approved	2025-06-03 16:30:18.232167	2025-06-03 16:54:24.418
55	Amr Taha	amrgabermousa@yahoo.com	RW9A-18	1117851815	approved	2025-06-03 17:46:50.642013	2025-06-03 17:48:14.554
54	Yehia Saad 	yehiasaad52@gmail.com	Jasper woods building 7 flat 35	01222440504	approved	2025-06-03 17:07:11.735168	2025-06-03 17:48:15.63
56	Mona Abbassy	mona.abbassy5@gmail.com	Amberville phase 1 - building 16B apt 22	01223342787	approved	2025-06-03 17:53:21.270074	2025-06-03 18:54:40.226
57	Gihan elvhakim	jehanelhakim@hotmail.com	Building E3 Aprt36	+201223124549	approved	2025-06-04 03:44:02.175491	2025-06-04 05:30:42.893
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.applications (id, applicant_name, applicant_email, applicant_phone, cover_letter, cv_file_name, cv_file_path, job_id, internship_id, status, notes, created_at, updated_at) FROM stdin;
6	Hagar Walid	hagaratif9@gmail.com	01094047268		\N	\N	15	\N	submitted	\N	2025-06-02 18:01:02.992387	2025-06-02 18:01:02.992387
7	Hagar Walid	hagaratif9@gmail.com	01094047268		\N	\N	19	\N	submitted	\N	2025-06-02 18:01:28.881747	2025-06-02 18:01:28.881747
8	Hagar Walid	hagaratif9@gmail.com	01094047268		\N	\N	31	\N	submitted	\N	2025-06-02 18:03:10.694667	2025-06-02 18:03:10.694667
9	Amna El-Tayeb	amnaeltayeb16@hotmail.com	01067880372		\N	\N	21	\N	submitted	\N	2025-06-03 08:29:29.357027	2025-06-03 08:29:29.357027
10	Amna El-Tayeb	amnaeltayeb16@hotmail.com	01067880372		\N	\N	16	\N	submitted	\N	2025-06-03 08:30:08.808106	2025-06-03 08:30:08.808106
11	Basma Nazif	basmanazif@gmail.com	01003716331		\N	\N	31	\N	submitted	\N	2025-06-03 12:31:51.404738	2025-06-03 12:31:51.404738
12	Basma Nazif	basmanazif@gmail.com	01003716331		\N	\N	19	\N	submitted	\N	2025-06-03 12:33:59.645228	2025-06-03 12:33:59.645228
13	Basma Nazif	basmanazif@gmail.com	01003716331		\N	\N	18	\N	submitted	\N	2025-06-03 12:34:30.960879	2025-06-03 12:34:30.960879
\.


--
-- Data for Name: community_benefits; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.community_benefits (id, title, description, discount_percentage, business_name, location, image_url, valid_until, category, is_active, show_on_homepage, created_at, updated_at, image_urls) FROM stdin;
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.courses (id, title, description, type, instructor, duration, price, start_date, end_date, max_attendees, current_attendees, location, is_online, registration_url, skills, is_active, is_featured, posted_by, created_at, updated_at, is_approved) FROM stdin;
\.


--
-- Data for Name: cv_showcase; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.cv_showcase (id, name, email, phone, title, section, bio, skills, experience, education, years_of_experience, cv_file_name, cv_file_path, linkedin_url, created_at, updated_at) FROM stdin;
63	Salma Abousenna	Salma.abousenna@aucegypt.edu		Head of Operations and assistant to CEO	Education	Ex-HEAD of Operations and assistant to CEO	Diplomacy; Teaching English; Translation.	Experience details to be updated		10+	\N	/uploads/cv-1748969741392-707895541.pdf	https://www.linkedin.com/in/salmaabousenna/	2025-06-02 05:18:39.058314	2025-06-03 16:55:41.735
64	Hagar Walid	hagaratif9@gmail.com	01094047268	Professional	Consulting	No information provided yet	To be updated	To be updated			\N	/uploads/cv-1748969690173-579852015.pdf		2025-06-02 18:37:59.194295	2025-06-03 16:54:52.306
65	Amna El-Tayeb	amnaeltayeb16@hotmail.com	01067880372	UN Volunteer - Project Assistant	Consulting	Professional with experience in UN volunteer work and project assistance	Project Management, Administrative Support, International Development	Experience in consulting and project assistance roles			\N	/uploads/cv-1748969755854-62075756.pdf		2025-06-01 10:00:00	2025-06-03 16:55:56.604
78	Mohamed Atef Mousa	mohamedatefmousa@outlook.com		Finance Manager / Financial Services Consultant	Finance	A finance professional with over nineteen years of solid accounting and ERP (SAP, Oracle, QuickBooks, Odoo) experience. Extensive experience in compiling and analyzing financial reports, establishing accounting control procedures, and developing financial management strategies. Strong IT skills in various accounting applications, with a background in auditing, taxation, budgeting, people management, and in-depth knowledge of legislative requirements. Currently Finance Manager at a Health Insurance and TPA Company, and also works as a self-employed Financial Services Consultant.	Financial Planning & Analysis, Budgeting, Financial Forecasting, Variance Analysis, KPI Tracking, Financial Modeling, Accounting Cycle Management, Financial Reporting (Monthly, Quarterly, Annual), Statutory Filings, Tax Returns, Audit Process Management, Internal Controls, Risk Management (Credit, Market, Operational), Cash Flow Management, Working Capital Management, Banking Relationships, Treasury Functions, Insurance Accounting, Premium Accounting, Claims Processing, Reserves, Team Management, Mentoring, SAP, Oracle, QuickBooks, Odoo, MS Office, Net Suite, Peachtree, Louts Notes, Gmail, Sox testing, Workflow Project Management, AP Management, AIM Project Management	 Currently Finance Manager at Health Insurance and TPA Company (from Aug 2024). Self-employed Financial Services Consultant (from Jan 2023). Previously Investment Manager at a Holding Company, UAE (Hybrid, Jan 2023 - Jan 2025). Finance Manager at Leasing & Advisors Company, Egypt (Feb 2020 - Aug 2024). Head of Financial Accounting at Medical Insurance Company, Egypt (Mar 2013 - Jan 2022). Senior Business Analyst/Verticent Accounting Expert at Egytrafo (Aug 2012 - Mar 2013). Various roles at ABB Egypt, including Sox testing manager, OF Assessor, Scanning & Workflow Project Manager, AIM Project Manager, AP Senior Specialist Accountant, Accounting Center Team Lead, and Senior Accountant (Jun 2003 - Aug 2012).	Bachelor's in Commercial Science, Cairo University (1999-2003). CMA study Part 1 (EY Egypt).\r\n	19+	\N	/uploads/cv-1748977786727-770016849.pdf		2025-06-03 19:09:49.965023	2025-06-03 19:09:49.965023
66	Basma Nazif	basmanazif@gmail.com	01003716331	Program Manager	Consulting	Experienced program manager with expertise in consulting services	Program Management, Strategic Planning, Project Coordination	Professional experience in program management and consulting			\N	\N		2025-06-01 11:00:00	2025-06-01 11:00:00
67	Amr Kamel	amr.kamel@newgiza.com		Marketing Professional	Marketing	Marketing professional with diverse experience	Marketing Strategy, Digital Marketing, Brand Management	Professional marketing experience			\N	\N		2025-06-01 12:00:00	2025-06-01 12:00:00
69	Hend Shafeek Hassan Damaty	Notexplicitly@gmail.com		Not specified	Technology/IT	Seeking a challenging position that provides opportunities for further experiences to assume greater responsibility and improve skills.	 Excel, Word, PowerPoint, Outlook, ICDL, Internet User, Communication Skills, Team Member, Arabic (Native), English (Good), French (Good)	Not specified	High Institute for Computer Science and Information Systems (Year of Graduation: 2006).	Not specified 	\N	/uploads/cv-1748976499334-459970139.pdf		2025-06-03 18:48:19.869318	2025-06-03 18:48:19.869318
82	Ghada Mahmoud Gheith	ghadagtheith66@gmail.com		Assistant Managing Director - Policies and Procedures Head / Operational Standards & Procedures Head	Banking / Operations / Policy & Procedures / Risk & Control	A banking professional with over 30 years of diversified experience in management and leadership, including Operations, Retail Banking, Corporate Banking, ICU, and Operations Standard & Procedures. Key achievements involve establishing and heading Policies & Procedures units, leading SOP projects post-migration, reflecting CBE governance in policies, and setting up new "Governance & Control" and "ICU Centralized Team" divisions.	anking Policies & Procedures Development, Operational Standards, SOP Creation & Management, Regulatory Compliance (CBE, AWB), Process Optimization, Business Process Re-Engineering, Risk Management, Governance & Control, ICU Centralized Team Management, RCA (Risk Control Assessment), Risk Evaluation, Internal Control, Corporate Banking, Retail Banking, Financial Crime, Tax Laws, Accounting Rule, Group Governance, Strategic Plan Implementation	Currently Assistant Managing Director - Policies and Procedures Head at Attijariwafabank Egypt (from Dec 2021). Previously Operational Standards & Procedures Head (Business Process Re-Engineering) at Attijariwafabank Egypt (May 2017 - Dec 2021). Operational Standard & Procedure Senior Manager / Internal Control Lead / Risk and Control Manager at Barclays Bank S.A.E (June 2008 - May 2017). Deputy Manager Corporate Banking Dept. at Cairo Barclays (Aug 2004 - Mar 2006). Earlier roles at Cairo Barclays and Banque Du Caire Barclays S.A.E, dating back to January 1989, including Manager's Assistant Corporate Banking, Corporate Senior Support, and Deputy Section Head Retail & Operations.\r\n	Bachelor of Commerce, Cairo University, Major Accounting (Jun 88). Thanawia Amaa Port Said Language School (May 84).\r\n	30+	\N	/uploads/cv-1748978372192-901141810.pdf		2025-06-03 19:19:44.607048	2025-06-03 19:19:44.607048
83	Hazem Hassanin	HHASSANIN72@GMAIL.COM		Freelancer (Strategy, OD, Culture, & Human Capital) / Consultant / CEO	HR	A seasoned Strategy, Business Transformation, Organizational Development, Culture, and Human Capital professional with proven track records in the design and execution of strategic, operational, and administrative-level interventions. Experienced in leading projects and collaborating with top knowledge and technology houses to drive public and private organizations towards adaptability, resilience, empowerment, innovation, collaboration, and leadership development to foster agility.	Strategic Leadership, Organizational Agility, Strategic Project Management, Digital Transformation, Talent Management & Development, Performance Management, Organizational Development (OD), Culture Transformation, Human Capital Strategy, Business Transformation, Growth Strategy, Customer-centric Strategies, Continuous Learning Frameworks, Innovation Culture, Kanban Project Management, Vendor Alliances, HR Technology, Agile Project Management, Shared Services Implementation, Business Process Outsourcing (BPO), Competency-based HR, Employee Retention, Compensation Structures	Currently a Freelancer focusing on Strategy, OD, Culture, & Human Capital, assisting SMEs in Egypt and the Gulf. Previously Chairman & CEO of Consulting Bay Corporation (S.A.E.), CEO of Global Innovation Company (NTEC Group, Kuwait), Group HR & Admin Director at Al-Hajery Group (Kuwait), HR Manager at Al-Nazaer for Artistic Production and Distribution Co. (Kuwait), Assistant HR Manager at Daewoo Motors (Egypt), HR Officer at EGA-Mercedes Benz industrial J.V. (Egypt), and Senior Tax Auditor at Deloitte Touche Tohmatsu International – Shawky & Co. (Egypt).	Associate's Degree in Organizational Leadership, Certified Organizational Manager (COM), Florida State University - College of Business, USA (2015-2017); Senior Professional in Human Resources - International (SPHRi™), HR Certification Institute (HRCI), USA (2013); Associate Certified Coach (ACC), International Coaching Federation – ICF, USA (2013); Human Resource Management Diploma, The American University in Cairo, Egypt (1999-2000); Bachelor's Degree in Commerce & Business Administration, Cairo University, Faculty of Commerce, Egypt (1990-1994).	25+	\N	/uploads/cv-1748979353782-411996694.docx		2025-06-03 19:35:54.336843	2025-06-03 19:35:54.336843
84	Muhammad Mounir Ali	m.mounir@aucegypt.edu		Program Manager / Higher Education Specialist	Education / Program Management	A dedicated Program Manager and Higher Education Specialist with over 12 years of progressive experience managing USAID-funded education programs at the American University in Cairo (AUC). Demonstrates success in program design, academic operations, learner support, stakeholder coordination, and implementation of Learning Management Systems (LMS). Recognized for outstanding communication, problem-solving, and leadership in diverse educational environments, with a passion for learner development, engagement strategies, and building cultures of academic excellence.	Higher Education Program Management, Learning Management Systems (LMS), Moodle, Blackboard, Academic & Learner Support Services, Stakeholder & Partner Engagement, Monitoring & Evaluation (M&E), Instructor Training & Coordination, Complaint Resolution & Conflict Management, Business & Strategic Planning, Logistics & Event Management, Cross-Cultural Communication, Argos, Banner System, Microsoft Office, CCNA, C++, Reporting & Evaluation Tools, Project Management, Strategic Management, Decision Making, Customer Care, Time Management, Proctoring & Supervision	Currently Program Manager for the USAID Scholars Program at The American University in Cairo (AUC). Previously Senior Program Specialist and Program Specialist in the Career Development Department and School of Continuing Education (SCE) at AUC. Earlier roles include Instructional Affairs Representative and Student Help Representative at AUC. Also held part-time/other roles as Chief Proctor for IELTS (IDP Education Ltd), Office Manager at Microhard, and an Entrepreneur (Computer Shop Owner).\r\n	B.Sc. in Accounting – Faculty of Commerce, Cairo University. Professional Development courses and workshops at The American University in Cairo (Project Management, Strategic Management, Decision Making, Microsoft Server 2003, CCNA, C++, Communication Skills, Customer Care, Time Management, Complaint Handling, Telephone Etiquette, Proctoring & Supervision).	12+	\N	/uploads/cv-1748979486888-340929728.docx		2025-06-03 19:38:07.581608	2025-06-03 19:38:07.581608
85	Batoul Mohamed Lotfy Gamaleldin	batoul.gamalaldin@gmail.com		Senior Research & Consumer Insight Leader / Senior Research Department Manager	Marketing	An insight-driven and results-oriented Senior Research & Consumer Insight Leader with over 20 years of experience in market research across the Middle East and North Africa. Proven ability to translate complex data into impactful strategic recommendations, supporting brand growth and marketing optimization. Known for driving added-value insights through synthesizing multi-source research, leading and mentoring high-performing research teams, and adeptly partnering with marketing, brand, and cross-functional teams to unlock business opportunities and inform decision-making.	Strategic Consumer Insights, Market Research, Multi-Methodology Analysis (Quantitative & Qualitative), Brand Health Tracking, Retail Audits, Stakeholder & Client Engagement, Team Leadership & Coaching, Regional Market Expertise (Egypt, Turkey, Iran, Sudan, North Africa), Marketing Strategy Support, Actionable Reporting, Business Storytelling, SPSS, Advanced MS Office (Excel, PowerPoint, Word, Access), Fluent in English & Arabic, Very good French	Currently Senior Research Department Manager at Savola Group – SMS (Strategic Marketing Services), Egypt (since Jan 2019). Previously held roles as Research Department Manager and Senior Research Manager / Research Manager within Savola Group – SMS. Prior experience includes Research Manager / Senior Research Executive at Feedback Market Research, Egypt. Earlier roles include Marketing Research Executive at Imtenan for Trade & Exports, Marketing & Advertising Executive at Marabou Optical/Hospital, and Marketing Research Analyst at RadaResearch and PR Co.\r\n	Master of Psychology, Liverpool John Moores University, UK (2019 – 2023); Bachelor of Arts in Business Administration – Marketing Major, The American University in Cairo (AUC), Egypt (June 1998); Advertising Diploma – International Advertising Association (IAA), AUC (1997).\r\nCertifications & Additional Training: Certified Coach, Intellect Coaching School, Egypt (2017); French Language Diploma, Alliance Française (1992).	20+	\N	/uploads/cv-1748979721732-241938712.docx		2025-06-03 19:42:02.22631	2025-06-03 19:42:02.22631
81	Hany Mohamad Nabil	hanynabiel@hotmail.com		Recruitment & Admin Manager / HR & Admin Supervisor	HR	A professional seeking a challenging position to develop technical and personal skills. Experienced in recruitment process management, administrative support (including social media, finance, web admin), job analysis, job description creation, organizational chart development, probation period evaluation, HR workflow improvement, exit interviews, and employee inquiry response.	Recruitment, Administration, Job Analysis, Job Description Writing, Organizational Charts, Probation Evaluation, HR Workflow Improvement, Exit Interviews, Manpower Planning, Employee Appraisal, Training Plan Design, Internal Training Supervision, Training Effectiveness, Performance Management (HR context), Microsoft Office (Word, Excel, PowerPoint, Outlook, Labor Tracker), Internet User	Currently, Recruitment & Admin Manager at Naqada Music Management (from May 2019). EL Haram Branch Manager – Outlet DPT at Aramex International CO. (Nov 2016 – May 2019). Recruitment Manager at Aras International CO – KSA (Oct 2015 – Sep 2016). HR & Admin Supervisor / HR & Admin Coordinator at Mantrac Distribution (Jan 2013 - Sep 2015 / Mar 2010 - Dec 2012). Training Center Administrator at New Horizons Computer Learning Centers (Dec 2006 - Feb 2010).\r\n	HR Career Certificate at the American University in Cairo (May 2014 - Mar 2015). Bachelor of Commerce, Major: Administration, The Higher Institute for Cooperative and Administrative Studies (Jun 2006).\r\n	10+	\N	/uploads/cv-1748978192010-299877659.pdf		2025-06-03 19:16:36.70471	2025-06-03 19:16:36.70471
70	Ziad Ibrahim	ZiadTantawy9@gmail.com		Software Engineering Intern / Computer Science Student	Technology/IT	A third-year Computer Science & Engineering student with internship experience at ITWorx and ElSewedy Electric, focusing on full-stack development, CRUD app creation, and IoT applications. Proficient in multiple programming languages and frameworks, with a strong interest in web development and machine learning.	Python, Java, JavaScript (ES5, ES6), TypeScript, HTML/CSS, C#, C, SQL, Haskell, Prolog, VHDL, ReactJS, Redux, Tailwind CSS, Bootstrap, NodeJS, ExpressJS, FastAPI, MongoDB, PostgreSQL, MS SQL Server, Pandas, Numpy, Matplotlib, Seaborn, Scikit-learn, Keras, TensorFlow, Pytorch, Git, npm, Vite, Postman, OOP, CRUD, API Optimization, IoT, Cybersecurity (awareness)	Software Engineering Intern at ITWorx (managed a team and developed a full-stack app with React, Python, FastAPI, and PostgreSQL). Software Engineering Intern at ElSewedy Electric (built a CRUD app with C#, Entity Framework, SQL Server). I participated in the Cisco Summer Orientation program (explored IoT, shadowed a Cybersecurity Architect).\r\n	German University in Cairo, Undergraduate Third Year Student, Faculty of Media Engineering & Technology (MET), Department of Computer Science & Engineering (2022-2027). Egypt British International School (EBIS), High School Diploma-IGCSE (2019-2022).\r\n	1+	\N	/uploads/cv-1748976812884-460715956.pdf		2025-06-03 18:53:33.918549	2025-06-03 18:53:33.918549
72	Heba Talaat	htalaat@hotmail.com		enior Regional Office Manager to the Executive Director / HR & Soft Skills Instructor	HR	A professional with over 20 years of extensive experience in core significant Administration and HR functions within Telecommunication, IT industries, diplomatic status institutes, and non-profit organizations. Also worked as an Instructor for HR & Soft Skills courses. Currently supporting an Executive Director by managing office operations and ensuring alignment with organizational goals.	Office Management, Executive Support, Stakeholder Liaison, Calendar Management, Travel Arrangements, Correspondence Handling, Meeting Coordination, Report Preparation, Confidential Information Handling, Filing Systems (Hardcopy & Electronic), Record Management, Workshop Participation, Information Flow Facilitation, Problem Solving, HR Coordination, Hiring Process, Resigning Process, Contract Preparation, Employee Documentation, Attendance System Management, Leave Process, Medical Insurance Management, Recruitment Life Cycle, Cafeteria Management, Marketing Campaign Assistance, Exhibition Process, Staff Training, Skills Profile Development, MS Word, MS Excel, MS PowerPoint, MS Outlook, Access Course, Touch Typing (English/Arabic)	 Currently Senior Regional Office Manager to the Executive Director at Centre for Environment & Development for Arab Region and Europe (CEDARE) since November 2010. Previously Executive Assistant to the Executive Director at The Egyptian Center for Economic Studies (ECES). Part-Time Instructor at School of Continuing Education – SCE, American University in Cairo, Cairo University & others. Office Manager for GM & DGM / Office Manager & HR Coordinator at Egypt Call for Communications. Executive Secretary/Marketing Assistant at Nile Soft International. Senior Secretary at RAMW for Tourism and Hotels. Secretary at American Express for Tourism.\r\n 	Bachelor of Commerce, Business Administration, Ain Shams University (1984). Lycée La Liberté Héliopolis. Certifications in Training of Trainers, Human Resources Management, and Management from AUC.	20+	\N	/uploads/cv-1748977069509-109337227.pdf		2025-06-03 18:57:52.583795	2025-06-03 18:57:52.583795
74	Habiba Kamel	habibakamel2001@gmail.com		Digital Marketing Professional / Aspiring Marketing Graduate	Marketing	An aspiring graduate with a strong interest in marketing, eager to apply academic knowledge in market analysis, consumer behavior, and campaign management. Possesses excellent communication skills and a proactive mindset, ready to adapt and thrive in fast-paced marketing environments. Experience in digital marketing, content creation, and various finance-related internships.	Digital Marketing, Social Media Campaigns, Content Creation, Performance Metrics, Event Logistics, Vendor Coordination, Press Releases, Company Analysis, ECM Updates, DCF Valuations, Brokerage Tasks, Client Financial Planning, Market Insights, Marketing Copywriting, Trend Tracking, Consumer Data Analysis, SAP (A/R), Logical and Systematic Thinking, Leadership Thinking, Relationship Building, Financial Data Analysis, Problem-solving, Communication Skills, Mimic social (Stukent Marketing Certified), Google Analytics (Fundamentals of Digital Marketing) certified, Digital Advertising certified, Social Media Marketing certified	Upcoming role in Digital Marketing at NEWGIZA Sports Club (from Feb 2025). Content Creation and Account Management at Momentum (Sept 2024 - Jan 2025). Internship experiences at Influence Communications, EFG Holding, Pioneer Securities, NATCO (SNA), and Finance Internship – A/R.\r\n	Bachelor of Business Administration, ESLSCA University, Cairo (Double major in finance and sports management, 2020-2024). El Alsson British and American International School (American Diploma Graduate, 2005-2020).\r\n	1+	\N	/uploads/cv-1748977214174-960081729.pdf	https://www.linkedin.com/in/habiba-kamel-282953223	2025-06-03 19:00:17.542661	2025-06-03 19:00:17.542661
76	Salma Youssef Mohamed	Sa.yousef89@yahoo.com		Talent Acquisition / HR Specialist	HR	 Human Resources professional specializing in Talent Acquisition, seeking new opportunities to gain experience and develop skills. Experienced in coordinating with hiring managers, designing job descriptions, sourcing candidates (online & offline), conducting interviews and selection procedures, assessing candidate information, forecasting hiring needs, and managing recruitment events and candidate tracking systems.	Talent Acquisition, Recruitment, Hiring Management, Job Description Design, Candidate Sourcing, Interviewing, Selection Process, Candidate Assessment, Hiring Forecast, Job Fairs, Candidate Tracking, Hiring Metrics, Job Offers, Onboarding Coordination, Manpower Reporting, Administrative Services, Social Media (for recruitment), Headhunting, Staff Performance Monitoring, Policy Implementation	Currently SR. Talent Acquisition at Travco Company (from Jan 2024). SR. Talent Acquisition at Kazyon Company (Sep 2022 — Nov 2023). Office Manager & HR Specialist at Blue Rock (Apr 2021 – Sep 2021). HR Recruitment Specialist at Andalusia group (Dec 2019 – July 2020). HR & Administration at BAT Company (Mar 2017 – Mar 2019). HR & Administration at Sun Pharma (Jan 2016 - Dec 2016). Medical Representative at RoVamed Pharma (Apr 2013 - Oct 2015). Customer Services at Vodafone UK (Mar 2012 - Mar 2013). Tele Marketing at Vodafone (Feb 2011 - Feb 2012).\r\n	Principles of Human Resources and Advanced Training-Diploma (2015). Bachelor of Social Service at the Higher Institute of Social Work (2010).	5+	\N	/uploads/cv-1748977479856-56748784.pdf		2025-06-03 19:04:40.880722	2025-06-03 19:04:40.880722
77	Mahmoud Elmaghraby	Mahmoud.elmaghraby11@gmail.com		Software Engineer	Technology/IT	 A highly motivated and passionate Software Engineer with a strong focus on delivering innovative and impactful, user-focused solutions. Experienced in frontend development (React.js, React Native, TypeScript/JavaScript), RESTful API integration, reusable component creation, state management (Redux Toolkit, Context API), and version control (Git). Also has freelancing experience in developing responsive web applications with ReactJS, NextJS, and TypeScript, leveraging SEO and performance optimization.	React.js, React Native, TypeScript, JavaScript, RESTful APIs, Redux Toolkit, Context API, Git, HTML5, CSS3, Angular, SASS, Bootstrap, TailwindCSS, Firebase, NodeJS, ExpressJS, MongoDB, C++, Java, Dart, NPM, OOP, SOLID, Data Structures, Algorithms, Problem Solving, Agile methodologies, Teamworking, Mentorship, Communication Skills	 Frontend Software Engineer at Netway Corp (from February 2025). Software Engineer [Freelancing] (November 2023 – January 2025).\r\n 	Bachelor's of Management Sciences (Major: Business Information Systems), Sadat Academy for Management Sciences (Sept 2018 – July 2022, Cumulative Grade: Good). Intensive Training Program – Information Technology Institute (ITI), Ministry of Communications and Information Technology (MCIT), Frontend and Cross-platform Mobile Development track (May 2024 – October 2024).	1+	\N	/uploads/cv-1748977606058-295843595.pdf	https://linkedin.com/in/Maghrabyy	2025-06-03 19:06:49.594331	2025-06-03 19:06:49.594331
71	Sama Tarek ElFergani	sama.elfergani175@gmail.com		CRM Specialist / Digital Marketing Specialist	Marketing	A marketing professional with upcoming and current experience as a CRM Specialist at Waffarha and a Digital Marketing Specialist (Performance Marketing) at Digi-tell Advertising Agency. Experience includes customer engagement, marketing automation (MoEngage), link tracking (Bitly, Firebase), campaign creation (email, push, SMS), user flow design, performance metrics analysis, customer journey mapping, content creation, localization, data analysis, media buying (Tiktok, Snapchat, Meta, Apple search, Google ads). Also interned in marketing and communications at Banque Misr and digital marketing at Gameball.	 MoEngage, Bitly, Firebase, Email Campaigns, App Push Notifications, In-app Messaging, SMS Marketing, User Flow Design, Performance Metrics, Customer Journey Mapping, Content Creation, Localization (English, Kuwaiti Arabic, Saudi Arabic), Data Analysis, Media Buying (Tiktok ads, Snapchat ads, Meta ads, Apple search, Google ads), Social Media Planning, SEO, Case Studies, MS Office Excel, Word, PowerPoint, SemRush (Beginner), Canva, Asanna, Flowchart	CRM Specialist at Waffarha (from Jan 2025). Digital Marketing Specialist (Performance Marketing) at Digi-tell Advertising agency (Aug 2024 - Dec 2024). Marketing and Communications Intern at Banque Misr (Feb 2024 - June 2024). Digital Marketing Intern at Gameball (Aug 2023 - Sep 2023).\r\n \r\n	German International University (2020-2024), Business Administration, Major: Digital Marketing, Minor: International Business (GPA: Very Good). IGCSE (2017-2020).	1+	\N	/uploads/cv-1748976941143-300776398.pdf	www.linkedin.com/in/samatarek1234	2025-06-03 18:55:41.569375	2025-06-03 18:55:41.569375
73	Heba Talaat	htalaat@hotmail.com		enior Regional Office Manager to the Executive Director / HR & Soft Skills Instructor	HR	A professional with over 20 years of extensive experience in core significant Administration and HR functions within Telecommunication, IT industries, diplomatic status institutes, and non-profit organizations. Also worked as an Instructor for HR & Soft Skills courses. Currently supporting an Executive Director by managing office operations and ensuring alignment with organizational goals.	Office Management, Executive Support, Stakeholder Liaison, Calendar Management, Travel Arrangements, Correspondence Handling, Meeting Coordination, Report Preparation, Confidential Information Handling, Filing Systems (Hardcopy & Electronic), Record Management, Workshop Participation, Information Flow Facilitation, Problem Solving, HR Coordination, Hiring Process, Resigning Process, Contract Preparation, Employee Documentation, Attendance System Management, Leave Process, Medical Insurance Management, Recruitment Life Cycle, Cafeteria Management, Marketing Campaign Assistance, Exhibition Process, Staff Training, Skills Profile Development, MS Word, MS Excel, MS PowerPoint, MS Outlook, Access Course, Touch Typing (English/Arabic)	 Currently Senior Regional Office Manager to the Executive Director at Centre for Environment & Development for Arab Region and Europe (CEDARE) since November 2010. Previously Executive Assistant to the Executive Director at The Egyptian Center for Economic Studies (ECES). Part-Time Instructor at School of Continuing Education – SCE, American University in Cairo, Cairo University & others. Office Manager for GM & DGM / Office Manager & HR Coordinator at Egypt Call for Communications. Executive Secretary/Marketing Assistant at Nile Soft International. Senior Secretary at RAMW for Tourism and Hotels. Secretary at American Express for Tourism.\r\n 	Bachelor of Commerce, Business Administration, Ain Shams University (1984). Lycée La Liberté Héliopolis. Certifications in Training of Trainers, Human Resources Management, and Management from AUC.	20+	\N	/uploads/cv-1748977071818-670694707.pdf		2025-06-03 18:57:54.481027	2025-06-03 18:57:54.481027
75	Habiba Kamel	habibakamel2001@gmail.com		Digital Marketing Professional / Aspiring Marketing Graduate	Marketing	An aspiring graduate with a strong interest in marketing, eager to apply academic knowledge in market analysis, consumer behavior, and campaign management. Possesses excellent communication skills and a proactive mindset, ready to adapt and thrive in fast-paced marketing environments. Experience in digital marketing, content creation, and various finance-related internships.	Digital Marketing, Social Media Campaigns, Content Creation, Performance Metrics, Event Logistics, Vendor Coordination, Press Releases, Company Analysis, ECM Updates, DCF Valuations, Brokerage Tasks, Client Financial Planning, Market Insights, Marketing Copywriting, Trend Tracking, Consumer Data Analysis, SAP (A/R), Logical and Systematic Thinking, Leadership Thinking, Relationship Building, Financial Data Analysis, Problem-solving, Communication Skills, Mimic social (Stukent Marketing Certified), Google Analytics (Fundamentals of Digital Marketing) certified, Digital Advertising certified, Social Media Marketing certified	Upcoming role in Digital Marketing at NEWGIZA Sports Club (from Feb 2025). Content Creation and Account Management at Momentum (Sept 2024 - Jan 2025). Internship experiences at Influence Communications, EFG Holding, Pioneer Securities, NATCO (SNA), and Finance Internship – A/R.\r\n	Bachelor of Business Administration, ESLSCA University, Cairo (Double major in finance and sports management, 2020-2024). El Alsson British and American International School (American Diploma Graduate, 2005-2020).\r\n	1+	\N	/uploads/cv-1748977217721-711799134.pdf	https://www.linkedin.com/in/habiba-kamel-282953223	2025-06-03 19:00:18.553965	2025-06-03 19:00:18.553965
80	Shahinaz Ahmed Abou El Naga	shahinaz@aucegypt.edu		Chief Human Capital Officer / Human Resources Director	HR	A seasoned HR professional with overall responsibility for aligning HR support to business strategies. Experienced in compensation, bonus plans, recruitment, employee relations, coaching, performance management, rewards & recognition, HR policies, HR communication, HR tools, turnover management, people development, and payroll validation. Successfully transformed HR from a functional department to business partnering and established an HR Services Center. Maintained Top Employer Certification.	HR Strategy, Business Partnering, Compensation & Benefits, Recruitment, Employee Relations, Coaching, Performance Management, Rewards & Recognition, HR Policies, HR Communication, HR Tools, Turnover Management, People Development, Payroll Validation, Job Evaluation, Top Employer Certification, Performance Management System, Succession Planning, HR Systems Management, Local Labor Law Compliance, Salary Review, HR Filing & Record Archiving, Management Training Programs, Organizational Leadership, Board Governance, Corporate Governance	Currently, Chief Human Capital Officer at Strategic Education & Growth Opportunities Group (SEGO) (from June 2024). Human Resources Consultant at Brightskies (May 2023 - June 2024). Human Resources Director at Valeo Egypt (December 2015 - December 2022). Head of Egypt Human Resources Department / HR Consultant at Orange Business Services (May 2005 - July 2015). Human Resources Manager / Sr. Human Resources Specialist / Human Resources Specialist at The American University in Cairo (January 1995 - April 2005). Sr. Secretary to the Manpower Planning Manager at Glaxo Wellcome (September 1992 - December 1994).\r\n 	Corporate Directors Certification Program, Directors of the Institute Egyptian (Issued April 2023). Human Resources Diploma, Institute of Management Development, AUC (1997). Bachelor of Arts, Mass Communication, AUC (June 1985). Attended KPI Professional Certification Program (2018).\r\n	20+	\N	/uploads/cv-1748978073043-806857903.PDF		2025-06-03 19:14:34.434882	2025-06-03 19:14:34.434882
79	Mona Sadek El Bakry	monaselbakry@gmail.com		Chief Operations Officer / Healthcare Management Professional / Lecturer	Healthcare Management / Education / Operations	 A dedicated professional with a strong proven track record of both Practical and Academic experiences (24 year+). Aims to take a leading role in a major academic institute or healthcare organization, utilizing extensive experience to improve the organization, be on the edge of technology and success, and achieve management objectives in terms of ROI and professional image. Extensive experience in hospital operations and patient services management, as well as lecturing in healthcare and business-related subjects.	Hospital Operations Management, Patient Services Management, Healthcare Administration, Strategic Planning, Performance Monitoring (KPIs), Project Management (Operational & Physical), Biomedical Department Supervision, Maintenance Management (PM & CM), CAPEX Planning, JCI Accreditation Preparation, Public Relations, Event Management, Patient Experience Program Development, Ethical Committee Participation, Safety & Occupational Health Management, Security Department Supervision, License Management, Organizational Behavior, Marketing Health Care Services, Human Resources, Supply Chain Management, Healthcare Quality (CPHQ), PMP	Extensive career at Dar Al Fouad Hospital (till November 2022), holding positions from Patients' Relations Supervisor up to Chief Operations Officer. Lecturer and course developer at the American University in Cairo (January 2011 – Present) and Approved Tutor at Edinburgh Business School (United Kingdom) (January 2012 – Present).\r\n 	MBA, Edinburgh Business School; PMP, Project Management Institute; CPHQ, Healthcare Quality certification Commission; Certificate of Supply Chain Management (SCM), American University in Cairo; Healthcare & Hospital Management Post-Graduate Diploma, American University in Cairo; Certified Director – Corporate Directors Certification Program, Egyptian Institute of Directors EIOD; Bachelor of Arts, English Literature Department, Faculty of Arts, Cairo University. Currently a PhD Student in the Management of Technology Department (MOT) at Nile University.	24+	\N	/uploads/cv-1748977926554-633708140.pdf		2025-06-03 19:12:09.796838	2025-06-03 19:12:09.796838
\.


--
-- Data for Name: email_whitelist; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.email_whitelist (id, email, name, unit, phone, is_active, added_by, created_at, updated_at) FROM stdin;
1	ghada.essawi11@gmail.com	\N	\N	\N	t	admin@ngbh.com	2025-05-27 18:34:54.252384	2025-05-27 18:34:54.252384
2	mohamed.yassein1988@gmail.com	Mohamed Yassin	\N	\N	t	\N	2025-05-28 06:48:23.701895	2025-05-28 06:48:23.701895
4	nouranncw@gmail.com	Nouran Elgemei	\N	\N	t	\N	2025-05-28 08:17:06.873591	2025-05-28 08:17:06.873591
5	sara.m.abdullah@gmail.com	Sara Abdallah	\N	\N	t	\N	2025-05-28 13:04:20.8013	2025-05-28 13:04:20.8013
6	hagaratif9@gmail.com	hagar walid 	\N	\N	t	\N	2025-05-28 17:56:04.164658	2025-05-28 17:56:04.164658
7	shadyallam20@gmail.com	Shady Allam	\N	\N	t	\N	2025-05-28 18:02:14.955696	2025-05-28 18:02:14.955696
8	dyna.elgamal94@gmail.com	Dina Ali	\N	\N	t	\N	2025-05-29 06:29:44.180546	2025-05-29 06:29:44.180546
9	hosam@ezzelarab.com	\N	\N	\N	t	admin@ngbh.com	2025-05-30 05:37:16.615022	2025-05-30 05:37:16.615022
10	heliashopegypt@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
11	essamselim2011@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
12	salma.ahmad872@yahoo.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
13	mayman@aucegypt.edu	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
14	ghadagheith66@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
15	randamfahmy@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
16	ibrahimdeif@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
17	asmaa.elbatran78@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
18	amshilal@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
19	amrabd2024@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
20	gigisalem20002010@hotmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
21	mervatmalash@hotmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
22	amanyzakikhalil@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
23	abouzekrys@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
24	ahlam.afify2@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
25	shahinaz@aucegypt.edu	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
26	belalb3@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
27	omelgamal@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
28	amr12461@yahoo.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
29	m_sherra@yahoo.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
30	arwawali@yahoo.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
31	eng.nourhan.hany@hotmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
32	passant.elgamal@gmail.co…	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
33	elgazzar32@gmail.com	\N	\N	\N	t	Excel Import	2025-05-30 08:06:07.592677	2025-05-30 08:06:07.592677
35	k.abbassi@medmark.eg	A Karim Abbassi	Villa 21 (ex 69) district 1	\N	t	Admin	2025-05-31 14:40:35.979794	2025-05-31 14:40:35.979794
38	khaledkassem1987@gmail.com	Khaled Kassem 	District 1 - Cliff 50A 	\N	t	Admin	2025-05-31 14:59:38.922007	2025-05-31 14:59:38.922007
39	mkhalifa88@gmail.com	Mahmoud Khalifa 	B1-11	\N	t	Admin	2025-05-31 15:14:16.710858	2025-05-31 15:14:16.710858
42	passant.elgamal@gmail.com	PASSANT ELGAMAL	E402	\N	t	Admin	2025-05-31 15:26:44.592045	2025-05-31 15:26:44.592045
43	nadineshafik@gmail.com	Nadine Salah Shafik	Av-33b-23	\N	t	Admin	2025-05-31 15:26:49.312768	2025-05-31 15:26:49.312768
44	safwathebs@gmail.com	Heba Safwat	Building E 3  Appt 4	\N	t	Admin	2025-05-31 16:30:09.943877	2025-05-31 16:30:09.943877
45	ghorabmmm@gmail.com	Mahmoud Mohammed Ghorab	Westridge, W-32-01	\N	t	Admin	2025-05-31 19:06:52.569514	2025-05-31 19:06:52.569514
46	salma.abousenna@aucegypt.edu	Salma Abousenna 	J934 	\N	t	Admin	2025-06-01 04:04:54.198381	2025-06-01 04:04:54.198381
47	sohaila.maged@gmail.com	Sohaila maged el sanadily	Ivoryhill 1 , TH9	\N	t	Admin	2025-06-01 05:17:58.849752	2025-06-01 05:17:58.849752
48	iman2211@hotmail.com	Iman Issawy	Jasperwood j11-06	\N	t	Admin	2025-06-01 05:18:02.002586	2025-06-01 05:18:02.002586
49	nannouzaki@yahoo.com	Nihal zaki	RB-03B-03	\N	t	Admin	2025-06-01 07:25:36.057767	2025-06-01 07:25:36.057767
50	rana.serageldin@gmail.com	Rana Serag ElDin	TV233 kings range	\N	t	Admin	2025-06-01 09:42:02.174203	2025-06-01 09:42:02.174203
51	mzorkany@efg-hermes.com	Mokhtar Elzorkany	34a p4 amberville 	\N	t	Admin	2025-06-01 10:38:20.981688	2025-06-01 10:38:20.981688
52	fatmaelemam@hotmail.com	Fatma Atteya Elemam 	Fairway 47- district one 	\N	t	Admin	2025-06-01 12:54:31.849726	2025-06-01 12:54:31.849726
53	ahmed.abdelgawad@adsero.me	Ahmed Abdelgawad	T 95	\N	t	Admin	2025-06-01 13:21:00.846491	2025-06-01 13:21:00.846491
54	mohamedshawkypg@gmail.com	Mohamed shawky	Westridge 76	\N	t	Admin	2025-06-01 17:09:02.88647	2025-06-01 17:09:02.88647
55	amshalaby52@gmail.com	Aly M Shalaby	E401	\N	t	Admin	2025-06-01 17:09:05.656049	2025-06-01 17:09:05.656049
56	omar.ebeid@gmail.com	Omar Ebeid	Kingsrange TV7-200	\N	t	Admin	2025-06-01 17:09:07.955315	2025-06-01 17:09:07.955315
57	k.zebda@gmail.com	Karim Zebda	NH7 - 38B  - G3	\N	t	Admin	2025-06-01 17:09:10.515042	2025-06-01 17:09:10.515042
58	sallamiss26@hotmail.com	Seif Omar El Sallami	Amberville-35B-22	\N	t	Admin	2025-06-01 17:59:35.930763	2025-06-01 17:59:35.930763
59	mohamedraghdan.mr@gmail.com	Mohamed Ahmed Mahmoud	AV2A, G2, Phase 1	\N	t	Admin	2025-06-01 18:40:03.460777	2025-06-01 18:40:03.460777
60	walid.atif@gmail.com	walid Mohamed Atef 	34A apartment 14	\N	t	Admin	2025-06-01 19:55:05.613604	2025-06-01 19:55:05.613604
61	malakelkilany@gmail.com	Malak El Kilany	F6-11 Carnel	\N	t	Admin	2025-06-01 19:55:09.155445	2025-06-01 19:55:09.155445
62	pmoez2005@yahoo.com	Pacint Moez	Jasperwood 222	\N	t	Admin	2025-06-02 04:06:59.837756	2025-06-02 04:06:59.837756
63	rashad67@yahoo.com	Rashad Aldemerdash	GS-GF 213 R KING'S RANGE	\N	t	Admin	2025-06-02 06:13:11.724209	2025-06-02 06:13:11.724209
64	mohamed.mounir@pinnacleltd.org	Mohamad Mounir	AV 27A 21	\N	t	Admin	2025-06-02 06:44:12.979348	2025-06-02 06:44:12.979348
65	elkady.aya@gmail.com	Aya El Kady	Westridge Rt 164	\N	t	Admin	2025-06-02 07:36:08.835468	2025-06-02 07:36:08.835468
66	emansaiedmahmoud@gmail.com	eman elsaied	J8-22 	\N	t	Admin	2025-06-02 07:36:11.45573	2025-06-02 07:36:11.45573
67	zelgamal@gmail.com	Abdelaziz ELGAMAL 	J631	01060108057	t	Admin	2025-06-02 14:53:08.542611	2025-06-02 14:53:08.542611
68	drayaabdulmoez@gmail.com	Aya AbdulMoez	villa rw34	01116111334	t	Admin	2025-06-02 14:53:21.257503	2025-06-02 14:53:21.257503
69	maryamwalid20@gmail.com	Maryam Walid	34A , 14	+201002474216	t	Admin	2025-06-02 17:47:40.166807	2025-06-02 17:47:40.166807
70	m.etreby83@gmail.com	Mohamed Hussein Eletreby 	Neighborhood 2 townhouse 46	01066810076	t	Admin	2025-06-02 17:56:46.681852	2025-06-02 17:56:46.681852
71	basmanazif@gmail.com	Basma Nazif	W-10-21	+201003716331	t	Admin	2025-06-02 17:57:38.361594	2025-06-02 17:57:38.361594
72	aliamebed@gmail.com	Alia Mebed 	B2 22	01118729091	t	Admin	2025-06-02 17:59:19.672404	2025-06-02 17:59:19.672404
73	mo.salaheldine@gmail.com	Mohamed Salah	Av6b/p3	01223303862	t	Admin	2025-06-02 17:59:30.184512	2025-06-02 17:59:30.184512
74	amrzak55@hotmail.com	Amr Zaki	RW 9-383	01222375676	t	Admin	2025-06-02 19:04:20.696754	2025-06-02 19:04:20.696754
75	amnaeltayeb16@hotmail.com	Amna El-Tayeb	3B - G4	+201067880375	t	Admin	2025-06-03 03:34:37.637261	2025-06-03 03:34:37.637261
76	janamahdy63@gmail.com	Jana Ahmed Mahdy	Carnell	01212465111	t	Admin	2025-06-03 16:24:24.500444	2025-06-03 16:24:24.500444
87	skholeif@gmail.com	Sara Kholeif	AV 13b- 21	01223275566	t	Admin	2025-06-03 16:54:25.089855	2025-06-03 16:54:25.089855
88	amrgabermousa@yahoo.com	Amr Taha	RW9A-18	1117851815	t	Admin	2025-06-03 17:48:14.540901	2025-06-03 17:48:14.540901
89	yehiasaad52@gmail.com	Yehia Saad 	Jasper woods building 7 flat 35	01222440504	t	Admin	2025-06-03 17:48:15.620866	2025-06-03 17:48:15.620866
90	mona.abbassy5@gmail.com	Mona Abbassy	Amberville phase 1 - building 16B apt 22	01223342787	t	Admin	2025-06-03 18:54:40.212055	2025-06-03 18:54:40.212055
91	jehanelhakim@hotmail.com	Gihan elvhakim	Building E3 Aprt36	+201223124549	t	Admin	2025-06-04 05:30:42.865365	2025-06-04 05:30:42.865365
\.


--
-- Data for Name: internships; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.internships (id, title, company, description, requirements, skills, department, duration, is_paid, stipend, location, positions, is_active, posted_by, created_at, updated_at, is_approved) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.jobs (id, title, company, description, requirements, skills, industry, experience_level, job_type, location, salary_range, is_active, posted_by, created_at, updated_at, is_approved, status, contact_email, contact_phone, poster_email, poster_role) FROM stdin;
19	Project Specialist – SWEET Project (Gender & Women Economic Empowerment)	Plan International Egypt	Implement and monitor the SWEET project focusing on gender and women's economic empowerment, coordinate with stakeholders, and contribute to program development and evaluation.	Experience in project implementation, monitoring and evaluation, stakeholder coordination, and a background in gender and women's empowerment programs.	Project Implementation, Monitoring and Evaluation, Stakeholder Coordination, Gender Empowerment	Other	Mid Level	Full-time	Cairo, Egypt		t	\N	2025-06-01 21:58:29.394139	2025-06-02 07:43:47.175	t	approved	NotSpecified@yahoo.com	00000000	Not specified	Staff
7	Test Job	TST	TEST TEST TEST		\N	Other	Entry Level	Full-time	Cairo	211	f	\N	2025-05-30 05:25:46.58635	2025-05-30 05:31:12.78	f	rejected	contact@company.com	TBD	\N	Staff
18	Senior Field Coordinator	UNICEF Egypt	Support the implementation of girls' empowerment programs across 27 governorates, coordinate with civil society and government partners, assess needs, implement capacity-building initiatives, and develop field monitoring plans.	Experience in program coordination, stakeholder engagement, capacity building, and field monitoring in community development or gender empowerment programs.	Program Coordination, Stakeholder Engagement, Capacity Building, Field Monitoring, Community Development	Other	Mid Level	Full-time	Cairo, Egypt		t	\N	2025-06-01 21:56:49.86707	2025-06-02 08:05:03.805	t	approved	NotSpecified@yahoo.com	00000000	Not Specified	Staff
17	Commercial Executive	Embassy of India, Cairo	Handle commercial and clerical tasks, including communication, documentation, and coordination with stakeholders.	Graduation, preferably in Economics/Commerce, proficiency in English and Arabic, good computer skills (Microsoft Office, Outlook, Internet, Social Media, PDF conversion), and typing speed over 30 wpm in English.	Economics, Commerce, Bilingual Communication, Computer Proficiency, Typing	Other	Mid Level	Full-time	Cairo, Egypt		t	\N	2025-06-01 21:55:01.008394	2025-06-02 08:05:04.995	t	approved	NotSpecified@yahoo.com	000000000	Not Specified	Staff
16	Administrative Staff	Embassy of Japan in Egypt	Manage official vehicle arrangements, supervise drivers, handle correspondence with the Egyptian Foreign Ministry, process shipments, assist in recruitment and HR procedures, manage airport operations for diplomats, and provide basic IT support.	Fluency in Arabic and English, experience in administrative or logistical roles, strong organizational and communication skills, IT proficiency, and familiarity with embassy operations are pluses.	Administration, Logistics, Communication, IT Support, Embassy Operations	Other	Mid Level	Full-time	Cairo, Egypt		t	\N	2025-06-01 21:52:32.308136	2025-06-02 08:05:06.013	t	approved	admin@ca.mofa.go.jp	00000000	Administration Section	Staff
15	 Project Officer (Green and Sustainable Transition)	European Union Delegation to Egypt	Responsible for advising on policy and managing programs related to the Green Transition, including energy, water, environment, and climate action. Tasks include policy dialogue, sector analysis, program management, and stakeholder coordination.	Experience in program management, policy analysis, and coordination with stakeholders in the fields of energy, environment, or climate action.	Program Management, Policy Analysis, Stakeholder Engagement, Renewable Energy, Environmental Policy	Other	Mid Level	Full-time	Cairo, Egypt		t	\N	2025-06-01 21:49:32.774133	2025-06-02 08:05:07.285	t	approved	y@yahoo.com	00000000	Head of Cooperation	Staff
28	Marketing Lead	The Baby Garage	Lead digital strategies (e-commerce background preferred)	Relevant experience in the field (1–5 years), creativity, digital knowledge	Marketing strategy, e-commerce	Marketing	Mid Level	Full-time	Sheikh Zayed, Egypt		t	\N	2025-06-02 10:35:33.242679	2025-06-02 12:35:12.376	t	approved	talent@thebabygarage.com	00000000	Unknown	Staff
26	Social Media Specialist	Janaty Nursery	Manage content creation and posting with flexible remote hours.	Relevant degree, Creativity, fluency in Arabic & English	Content creation, social media strategy	Marketing	Entry Level	Part-time	Sheikh Zayed, Egypt		t	\N	2025-06-02 10:30:06.836134	2025-06-02 12:35:26.247	t	approved	NotSpecified@yahoo.com	0100 6277300	Unknown	Staff
24	DevNet Internship	IBM	Hands-on internship focused on network automation, working with tech teams on innovation and development.	Recent graduates or students in Computer Science, Engineering, or related fields	Network automation, programming, and collaboration	Technology/IT	Entry Level	Contract	Remote		t	\N	2025-06-02 10:26:54.671376	2025-06-02 12:35:32.108	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
25	English Teacher	Janaty Nursery	Teach young children aged 3–11, plan lessons, and support development.	Relevant degree, experience with children (teacher), creativity, fluency in Arabic & English	Teaching, classroom management	Education	Entry Level	Full-time	Sheikh Zayed, Egypt		t	\N	2025-06-02 10:28:24.06188	2025-06-02 13:24:47.811	t	approved	NotSpecified@yahoo.com	0100 6277300	Unknown	Staff
23	Marketing	A Leading Company specializing in Hospitals and Clinics Management	- Marketing Department:\nHead of Digital Marketing\nContent Creator\n2D Designer\nAccount Manager	 Proven experience in respective departments	Leadership, industry knowledge, marketing design, team management	Marketing	Mid Level	Full-time	New Cairo, Cairo, EGY		t	\N	2025-06-02 10:23:44.779422	2025-06-02 13:24:53.373	t	approved	hr@hicare-med.com	00000000	Unknown	Staff
22	Medical Sector	A Leading Company specializing in Hospitals and Clinics Management	- Medical Sector:\nHead of HR\nFinancial Manager\nOperations Manager\nProcurement Manager	Medical sector experience (for relevant roles), proven experience in respective departments	Leadership, industry knowledge, marketing design, team management	Healthcare	Senior Level	Full-time	New Cairo, Cairo, EGY		t	\N	2025-06-02 10:22:05.560016	2025-06-02 13:24:57.701	t	approved	hr@hicare-med.com	00000000	Unknown	Staff
21	National UN Volunteer – Project Assistant	 UNV / United Nations Development Programme (UNDP)	Support in project administration, logistics, and documentation related to development programs.	Bachelor’s degree, basic project support experience, fluency in Arabic and English.	Communication, documentation, teamwork, organization	Consulting	Entry Level	Contract	Cairo, Egypt	Volunteer (living allowance applies)	t	\N	2025-06-02 10:17:09.33205	2025-06-02 13:25:01.8	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
20	Project Coordinator – ILO (Subject To Funding)	Plan International Egypt	Responsible for project implementation, coordination, planning, monitoring, and reporting in line with donor requirements and organizational standards.	Experience in project management, preferably in education or employment-related programs.	Project coordination, reporting, stakeholder communication	Education	Mid Level	Full-time	Alexandria, Egypt		t	\N	2025-06-02 10:15:28.530966	2025-06-02 13:25:06.316	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
35	Food Factory Maintenance Manager	Leading Company in Food & Beverage Sector	We are seeking an experienced Maintenance Manager to oversee maintenance operations in a food manufacturing facility, ensuring the efficiency, safety, and reliability of all machinery and equipment.		Experience in the relevant field.	Engineering	Senior Level	Full-time	Egypt		t	\N	2025-06-02 11:00:55.219127	2025-06-02 12:33:53.286	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
34	Agriculture Engineer	Leading Company in Food & Beverage Sector	We are seeking 5 motivated engineers to join our Agriculture department, working on crop management, agricultural systems, and sustainable farming solutions.		Relevant field experience	Engineering	Mid Level	Full-time	Egypt		t	\N	2025-06-02 10:57:33.578385	2025-06-02 12:34:33.602	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
33	Production Engineer	Leading Company in Food & Beverage Sector	We are seeking 5 motivated engineers to join our Production department, optimizing manufacturing processes and supporting efficient day-to-day operations.		Relevant field experience	Engineering	Mid Level	Full-time	Egypt		t	\N	2025-06-02 10:56:43.84351	2025-06-02 12:34:37.4	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
32	Quality Engineer	Leading Company in Food & Beverage Sector	We are seeking 5 motivated engineers to join our Quality department, ensuring product standards, compliance, and continuous quality improvements.		Relevant field experience	Engineering	Mid Level	Full-time	Egypt		t	\N	2025-06-02 10:55:58.068953	2025-06-02 12:34:43.403	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
31	Program Manager	Friedrich-Ebert-Stiftung (FES) Egypt Office	Join FES Egypt as a Program Manager to manage impactful projects in socio-economic and political development. The role includes program development, partner collaboration, and contributing to social justice and democratic values.	Fluent in Arabic & English\n5+ years of relevant experience\nStrong networks in civil society\nStrategic thinking and teamwork\nEgyptian nationality required	Program Management, Civil Society Engagement, Strategic Thinking, Communication, Bilingual (Arabic & English)	Consulting	Senior Level	Full-time	Cairo, Egypt		t	\N	2025-06-02 10:40:33.337185	2025-06-02 12:34:46.932	t	approved	recruitment.egypt@fes.de	00000000	Unknown	Staff
30	Indoor Sales Executives	The Baby Garage	Indoor sales, preferably with SAAS or tech exposure	Relevant experience in the field (1–5 years), creativity, digital knowledge	Sales, e-commerce	Sales	Senior Level	Full-time	Sheikh Zayed, Egypt		t	\N	2025-06-02 10:39:12.362812	2025-06-02 12:35:00.911	t	approved	talent@thebabygarage.com	00000000	Unknown	Staff
29	Business Development Lead	The Baby Garage	Grow business opportunities	Relevant experience in the field (1–5 years), creativity, digital knowledge	Business development, e-commerce	Sales	Senior Level	Full-time	Sheikh Zayed, Egypt		t	\N	2025-06-02 10:37:51.764376	2025-06-02 12:35:06.116	t	approved	talent@thebabygarage.com	00000000	Unknown	Staff
27	Female Marketing & Social Media Specialist	Memark Group	Develop and execute digital marketing campaigns using AI tools, manage social platforms, and engage target audiences.	2+ years of experience, AI tool proficiency, creative skills	Social media management, content creation, digital marketing, AI tools	Marketing	Mid Level	Full-time	New Giza, Egypt		t	\N	2025-06-02 10:31:27.867643	2025-06-02 12:35:17.231	t	approved	NotSpecified@yahoo.com	01002333888 (WhatsApp)	Unknown	Staff
36	Sales	New Giza	We're hiring a number of Sales Representatives to join our team		Sales	Real Estate	Entry Level	Full-time	Egypt		t	\N	2025-06-02 14:24:47.596756	2025-06-02 14:54:00.345	t	approved	NotSpecified@yahoo.com	00000000	Unknown	Staff
37	Public Relations Account Executive 	The Consultants Communications 	We are seeking a dynamic and results-driven PR Account Executive to join our growing team. In this role, you will be responsible for managing day-to-day client relations, supporting the execution of communication strategies, and helping deliver impactful campaigns that enhance our clients’ public image and media presence.		Bachelor’s degree in Public Relations, Communications, Marketing, Journalism.	Marketing	Executive	Full-time	Giza, Egypt		t	\N	2025-06-03 18:47:15.290798	2025-06-03 18:53:51.861	t	approved	tamer.hassan@theconsultants-eg.com	01117883335	sara.m.abdullah@gmail.com	Hiring Manager
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.profiles (id, user_id, name, title, company, bio, skills, industry, experience_level, contact, linkedin_url, portfolio_url, is_visible, created_at, updated_at, phone, how_can_you_support, cv_file_name, cv_file_path) FROM stdin;
5	\N	Ghada Gheith 	Senior Manager Policies and Procedures 	Attijariwafabank 	\N	\N	Consulting	\N	ghadagheith66@gmail.com	\N	\N	t	2025-06-01 19:49:04.49963	2025-06-01 19:49:04.49963	01009550032	\N	\N	\N
6	\N	Mohamed Yassein	Technology Consultant 				Technology/IT		mohamed.yassein1988@gmail.com		\N	t	2025-06-02 07:00:17.531286	2025-06-02 07:42:53.642	01096899444		Mohamed Anwar Yassein - CV 2025.pdf	/uploads/cv-1748849675761-772279436.pdf
4	\N	SHAHINAZ ABOU EL NAGA 	Cheif Human Capital Officer 	Freelance HR Consultant 	I had the overall responsibility for the HR Department in Egypt to align the HR support to the business.\r\nstrategies while supporting the customers (employees & management team) in the areas of \r\ncompensation, bonus plan, recruitment, employee relations, coaching, performance management, \r\nrewards and recognition, HR policies, HR communication, HR tools, turnover (employee departures, \r\nemployee transfers, internal and external mobility), people development and payroll validation.\r\nI managed to transform the HR Department from functional department to business partnering with \r\nthe addition of having a new HR Services Center handling the administration part of all Hr functions. I \r\nworked on and maintained receiving the Top Employer Certification.\r\nBefore that I spent ten years in Orange Business Services, started by the position of HR Consultant and \r\nended up Heading the HR Department for Egypt Site. Manage the HR functions to guarantee the \r\nefficient delivery of the HR functional contribution to the company in the short and long term. Initiate \r\nand support the job description and job evaluation process. Develop and implement recruitment plan \r\nto ensure that the company is seen as the Employer of Choice and right recruitment processes and \r\nselection techniques are in place to recruit the right employee. Worked on and maintained receiving \r\nthe Top Employer Certification. Maintain the company performance management system, reward \r\nstructure and career succession planning Ensure that all processes that are linked with performance \r\nmanagement and career succession planning are monitored by the HR team in order to ascertain that \r\nall employees are equipped with the appropriate skills and knowledge to perform to their best Provide \r\nguidance and direction to the local HR team to ensure the implementation of the HR strategy and \r\nplans. Provide expert advice and coaching to managers to help them achieve their people objectives \r\nand initiate actions to motivate and engage people. Maintain and manage the HR systems and tools \r\nthrough efficient usage to ensure data integrity of all staff records Build multi-functional relationships, \r\nboth as a member of the top management team and when working with people across all functions\r\non a day to day basis, creating an environment where information and resources are shared in pursuit \r\nof business goals. Manage and implement the compensation and benefits programs and policies to \r\nensure that the organization is properly positioned in concurrence with the company strategy. Guide \r\nmanagement and employee actions by developing, writing, and updating policies, procedures and \r\nguidelines to be in line with the local labor law. Prepare and administer the annual salary review for \r\nOBS Egypt employees Comply with the local labor law and local legal requirements by studying \r\nexisting and new legislation. Ensure an efficient HR filing and record archiving system 		Human Resources		shahinaz@aucegypt.edu		\N	t	2025-06-01 16:26:17.522863	2025-06-02 08:41:55.746	01227335226		\N	\N
7	\N	Ahmed abdel Gawad	Teacher of Law and Partner 	Cairo University and ADSERO Law Firm	I am teacher of criminal law and M&A and Capital Markets later for 20 years.	\N	Legal	\N	ahmed.abdelgawad@adsero.me	\N	\N	t	2025-06-02 17:42:53.628921	2025-06-02 17:42:53.628921	01068827285	Happy to provide general legal advisory or direct to relevant experts	\N	\N
9	\N	Tamer Hassan	Public Relations Consultant 	\N	\N	\N	Consulting	\N	tamer.hassan.ali@gmail.com	\N	\N	t	2025-06-02 18:10:28.06938	2025-06-02 18:10:28.06938	\N	\N	\N	\N
8	\N	Sara Abdallah	Event Manager				Marketing		sara.m.abdullah@gmail.com		\N	t	2025-06-02 18:08:14.682819	2025-06-02 19:56:01.55			\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, email, name, role, created_at, updated_at, last_login_at) FROM stdin;
\.


--
-- Name: access_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.access_requests_id_seq', 57, true);


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.applications_id_seq', 13, true);


--
-- Name: community_benefits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.community_benefits_id_seq', 17, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.courses_id_seq', 1, false);


--
-- Name: cv_showcase_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.cv_showcase_id_seq', 85, true);


--
-- Name: email_whitelist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.email_whitelist_id_seq', 91, true);


--
-- Name: internships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.internships_id_seq', 1, true);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.jobs_id_seq', 37, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.profiles_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: access_requests access_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.access_requests
    ADD CONSTRAINT access_requests_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: community_benefits community_benefits_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.community_benefits
    ADD CONSTRAINT community_benefits_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: cv_showcase cv_showcase_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.cv_showcase
    ADD CONSTRAINT cv_showcase_pkey PRIMARY KEY (id);


--
-- Name: email_whitelist email_whitelist_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_whitelist
    ADD CONSTRAINT email_whitelist_email_unique UNIQUE (email);


--
-- Name: email_whitelist email_whitelist_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.email_whitelist
    ADD CONSTRAINT email_whitelist_pkey PRIMARY KEY (id);


--
-- Name: internships internships_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: applications applications_internship_id_internships_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_internship_id_internships_id_fk FOREIGN KEY (internship_id) REFERENCES public.internships(id);


--
-- Name: applications applications_job_id_jobs_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_job_id_jobs_id_fk FOREIGN KEY (job_id) REFERENCES public.jobs(id);


--
-- Name: courses courses_posted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_posted_by_users_id_fk FOREIGN KEY (posted_by) REFERENCES public.users(id);


--
-- Name: internships internships_posted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.internships
    ADD CONSTRAINT internships_posted_by_users_id_fk FOREIGN KEY (posted_by) REFERENCES public.users(id);


--
-- Name: jobs jobs_posted_by_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_posted_by_users_id_fk FOREIGN KEY (posted_by) REFERENCES public.users(id);


--
-- Name: profiles profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

