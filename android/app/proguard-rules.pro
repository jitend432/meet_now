# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# ==========================================
# Razorpay ProGuard Rules
# ==========================================
-keep class com.razorpay.** {*;}
-dontwarn com.razorpay.**

# ==========================================
# Retrofit / OkHttp / Axios Native Bridges Rules
# ==========================================
-keepattributes Signature, InnerClasses, EnclosingMethod

# Agar aap serializable models use kar rahe hain response parse karne ke liye
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
