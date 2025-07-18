

const API_URL='http://localhost:3001/';

const authpage=document.querySelector("#auth-page");
const signupform =document.getElementById("signup-form");
const loginform =document.getElementById("login-form");
const navbarloginbtn=document.querySelector(".navbar-login-btn");
const mainwebsite=document.getElementById("main-website");
const logoutbtn=document.querySelector(".navbar-logout-btn");
const adminDashboard = document.getElementById("admin-dashboard");


//admin password
document.querySelector(".options-login").addEventListener("change", () => {
    const role = document.querySelector(".options-login").value;
    const adminPasswordField = document.querySelector(".admin-password");

    if (role === "admin") {
        adminPasswordField.classList.remove("hidden");
    } else {
        adminPasswordField.classList.add("hidden");
    }
});




const hamburger = document.getElementById("hamburger-btn");
  const menu = document.getElementById("navbar-menu");

  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

  
function hidesignupform(){
    signupform.classList.add("hidden");
    loginform.classList.remove("hidden");
    navbarloginbtn.classList.add("hidden");
}

function hideloginform(){
    document.querySelector("#buyed-courses").classList.add("hidden");
    authpage.classList.add("hidden");
    loginform.classList.add("hidden");
    signupform.classList.add("hidden");
    
    navbarloginbtn.classList.add("hidden");
    logoutbtn.classList.remove("hidden");

    const role = localStorage.getItem("role");

    if (role === "admin") {
        adminDashboard.classList.remove("hidden");
        mainwebsite.classList.add("hidden");
        fetchAdminCourses();
    } else {
        document.querySelector("#buyedcourses").classList.remove("hidden");
        document.querySelector(".allcourses").classList.remove("hidden");
        mainwebsite.classList.remove("hidden");
        adminDashboard.classList.add("hidden");
        fetchCourses();
    }
}


function adminaddcourseform(){
    document.querySelector("#admin-add-course-form").classList.remove("hidden");
}
document.querySelector("#show-add-form").addEventListener("click",adminaddcourseform);


//signup
async function signup(event){
    event.preventDefault();
    const username=document.getElementById("signup-name").value;
    const email=document.getElementById("signup-email").value;
    const password=document.getElementById("signup-password").value;
    const role=document.querySelector(".options-signup").value;
    
    const response= await fetch(API_URL + `${role}/signup`,{
          headers: {
        'Content-Type': 'application/json'
         },
        method:"POST",
        body:JSON.stringify({email,password,username})
    })
    const data=await response.json();
    
    if(data.message !=="you are already signup"){
        hidesignupform();
    };

}
signupform.addEventListener("submit", signup);

//login
async function login(event){
    event.preventDefault();

    const email=document.getElementById("login-email").value;
    const password=document.getElementById("login-password").value;
    const role=document.querySelector(".options-login").value;
    const adminpassword = document.getElementById("Admin-password").value;

    
    if(role=="admin"){
        if (!adminpassword) {
           alert("Admin password is required");
           return;
        }
        const response= await fetch(API_URL + "admin/login",{
        method:"POST",
         headers: {
        'Content-Type': 'application/json'
         },
        body:JSON.stringify({email,password,adminpassword})
        })
         const data=await response.json();
         if(data.token){
           localStorage.setItem("token",data.token);
           localStorage.setItem("role",role);
          hideloginform();
        
       
        
       }
       else{
          alert(data.message);
       }


    }
    else{
        const response= await fetch(API_URL + "users/login",{
        method:"POST",
         headers: {
        'Content-Type': 'application/json'
         },
        body:JSON.stringify({email,password})
        })
            const data=await response.json();
        if(data.token){
          localStorage.setItem("token",data.token);
          localStorage.setItem("role",role);
          hideloginform();
        
       
        
        }
        else{
          alert(data.message);
        }

    }
    
    
    
    


}
loginform.addEventListener("submit", login);

//logout 
document.querySelector(".navbar-logout-btn").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload(); // Or redirect to login screen  (got to know from gpt)
};


//fetch courses admin
async function fetchAdminCourses() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(API_URL + "admin/courses", {
            headers: { token }
        });

        const data = await response.json();
        const adminCourseList = document.getElementById("admin-course-list");
        adminCourseList.innerHTML = "";

        if (!data.courses || data.courses.length === 0) {
            adminCourseList.innerHTML = "<p>No courses added yet.</p>";
            return;
        }
        
        data.courses.forEach(course => {
        const newCourse = document.createElement("div");
        newCourse.classList.add("course-card");
        
        const courseimg = document.createElement("img");
        courseimg.classList.add("course-img");
        courseimg.src=course.imageUrl;
        courseimg.alt=course.imageUrl;
        
        const coursecontent=document.createElement("div");
        coursecontent.classList.add("course-content");


        const courseTitle = document.createElement("div");
        courseTitle.classList.add("course-title");
        courseTitle.textContent = course.title;

        const courseDescription = document.createElement("div");
        courseDescription.classList.add("course-description");
        courseDescription.textContent = course.description;

        const coursePrice = document.createElement("div");
        coursePrice.classList.add("course-price");
        coursePrice.textContent = "₹" +course. price;
        
        newCourse.appendChild(courseimg);
        coursecontent.appendChild(courseTitle);
        coursecontent.appendChild(courseDescription);
        coursecontent.appendChild(coursePrice);

        newCourse.appendChild(coursecontent);

        adminCourseList.appendChild(newCourse);
         });
    } catch (err) {
        console.error("Error fetching admin courses", err);
    }
}

//fetch courses buyed 
const buyedcoursesbtn=document.querySelector("#buyedcourses");
const buyedcoursescoursegrid=document.querySelector("#buyedcourses-course-grid");

async function fetchbuyedcourses(){
    document.querySelector("#buyedcourses").classList.add("hidden");
    document.querySelector(".allcourses").classList.add("hidden");
    const token=localStorage.getItem("token");
    try{
        const response=await fetch(API_URL+"courses/my/purchased",{
            headers:{token}
        });
        const data = await response.json();
        buyedcoursescoursegrid.innerHTML="";
        if (!data.courses || data.courses.length === 0) {
            buyedcoursescoursegrid.innerHTML = "<p>No courses purchased yet.</p>";
            return;
        }
        data.courses.forEach(course => {
        const newCourse = document.createElement("div");
        newCourse.classList.add("course-card");
        
        const courseimg = document.createElement("img");
        courseimg.classList.add("course-img");
        courseimg.src=course.imageUrl;
        courseimg.alt=course.imageUrl;
        
        const coursecontent=document.createElement("div");
        coursecontent.classList.add("course-content");


        const courseTitle = document.createElement("div");
        courseTitle.classList.add("course-title");
        courseTitle.textContent = course.title;

        const courseDescription = document.createElement("div");
        courseDescription.classList.add("course-description");
        courseDescription.textContent = course.description;

        const coursePrice = document.createElement("div");
        coursePrice.classList.add("course-price");
        coursePrice.textContent = "₹" +course. price;
        
        newCourse.appendChild(courseimg);
        coursecontent.appendChild(courseTitle);
        coursecontent.appendChild(courseDescription);
        coursecontent.appendChild(coursePrice);

        newCourse.appendChild(coursecontent);

        buyedcoursescoursegrid.appendChild(newCourse);
         });


    }
    catch(err){
        console.error("Error fetching admin courses", err);
    }
}

document.getElementById("back-to-main").addEventListener("click", () => {
    document.querySelector("#buyedcourses").classList.remove("hidden");
    document.querySelector(".allcourses").classList.remove("hidden");
    document.getElementById("buyed-courses").classList.add("hidden");
    mainwebsite.classList.remove("hidden");

});



buyedcoursesbtn.addEventListener("click",()=>{
    mainwebsite.classList.add("hidden");
    document.querySelector("#buyed-courses").classList.remove("hidden");
    fetchbuyedcourses();
})
//add courses dashboard

const addcourseform=document.querySelector("#admin-add-course-form");
async function addcourse(event){
    event.preventDefault();

    const title = document.getElementById("admin-course-title").value;
    const description = document.getElementById("admin-course-description").value;
    const imageUrl = document.getElementById("admin-course-image").value;
    const price = parseFloat(document.getElementById("admin-course-price").value);
    const token = localStorage.getItem("token");

        const response = await fetch(API_URL + "admin/courses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            body: JSON.stringify({ title, description, imageUrl, price })
        });

        const data = await response.json();
        

        
        document.getElementById("admin-add-course-form").classList.add("hidden");
        document.getElementById("admin-add-course-form").reset();


        fetchAdminCourses();
    

}
addcourseform.addEventListener("submit", addcourse);











//purchase courses
async function purchasecourse(courseid){
    const token=localStorage.getItem('token');
    const role=localStorage.getItem('role');

    const response=await fetch(API_URL+`courses/purchase/${courseid}`,{
        method:"POST",
        headers:{
            'token':token
        }
    })
    const data=await response.json();
    alert(data.message);

}



//add a new course to the dom
function addCourse(course) {
    const courseGrid = document.getElementById("course-grid");
        const newCourse = document.createElement("div");
        newCourse.classList.add("course-card");
        
        const courseimg = document.createElement("img");
        courseimg.classList.add("course-img");
        courseimg.src=course.imageUrl;
        courseimg.alt=course.imageUrl;
        
        const coursecontent=document.createElement("div");
        coursecontent.classList.add("course-content");


        const courseTitle = document.createElement("div");
        courseTitle.classList.add("course-title");
        courseTitle.textContent = course.title;

        const courseDescription = document.createElement("div");
        courseDescription.classList.add("course-description");
        courseDescription.textContent = course.description;

        const coursePrice = document.createElement("div");
        coursePrice.classList.add("course-price");
        coursePrice.textContent = "₹" +course. price;
        
        const buyButton=document.createElement("button");
        buyButton.classList.add("buy-btn");
        buyButton.textContent = "Buy Now"; 
        buyButton.addEventListener("click",()=>{
            purchasecourse(course._id)
        })

    newCourse.appendChild(courseimg);
    coursecontent.appendChild(courseTitle);
    coursecontent.appendChild(courseDescription);
    coursecontent.appendChild(coursePrice);

    newCourse.appendChild(coursecontent);

        
     
    newCourse.appendChild(buyButton);
    courseGrid.appendChild(newCourse);
      
}



//fetch courses from backend
async function fetchCourses() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(API_URL + "courses/all", {
            headers: {
                'token': token 
            }
        });

        const data = await response.json();
        const courseGrid = document.getElementById("course-grid");
        courseGrid.innerHTML = '';

        if (!data.courses || data.courses.length === 0) {
            courseGrid.innerHTML = '<div class="no-courses">No courses available yet</div>';
            return;
        }

        for(let i = 0; i < data.courses.length; i++) {
            addCourse(data.courses[i]);
        }
    } catch (error) {
        console.error('Error fetching courses:', error);
        const courseGrid = document.getElementById("course-grid");
        courseGrid.innerHTML = '<div class="error">Failed to load courses. Please try again later.</div>';
    }
}

// Fetch existing couses when the page loads

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("token")) {
        hideloginform();
        fetchCourses();
    } else {
        // Show auth page, hide main website
        authpage.classList.remove("hidden");
        mainwebsite.classList.add("hidden");
        signupform.classList.remove("hidden");
        loginform.classList.add("hidden");

        navbarloginbtn.classList.remove("hidden");
        logoutbtn.classList.add("hidden");
    }
});

document.querySelector(".navbar-login-btn").onclick = function() {
    signupform.classList.add("hidden");
    loginform.classList.remove("hidden");
};

