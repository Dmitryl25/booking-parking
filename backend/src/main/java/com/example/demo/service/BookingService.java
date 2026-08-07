package com.example.demo.service;


import com.example.demo.dto.*;
import com.example.demo.entity.Category;
import com.example.demo.entity.Office;
import com.example.demo.entity.Spot;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.OfficeRepository;
import com.example.demo.repository.SpotRepository;
import com.example.demo.repository.UserRepository;
import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.passay.PasswordGenerator;


import java.time.ZonedDateTime;
import java.util.*;

@Service
@Transactional
public class BookingService {

    @Autowired
    OfficeRepository officeRepository;

    @Autowired
    CategoryRepository catRepository;

    @Autowired
    SpotRepository spotRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Office createOffice(OfficeView office_view) {
        if (officeRepository.existsByAddress(office_view.getAddress())) {
            throw new RuntimeException("Office with this address already exists");
        }
        Office office = new Office();
        office.setAddress(office_view.getAddress());
        officeRepository.save(office);
        return office;
    }

    public List<FullOfficeView> getAllOffice() {
        List<FullOfficeView> ans = new ArrayList<>();
        List<Office> officeList = officeRepository.findAll();
        for (Office office : officeList) {
            FullOfficeView view = new FullOfficeView();
            view.setAddress(office.getAddress());
            view.setId(office.getId());
            ans.add(view);
        }

        return ans;
    }

    public void updateOffice(OfficeView office_view, Long id) {
        if (!officeRepository.existsById(id)) {
            throw new RuntimeException("Office not found");
        }
        Office office = officeRepository.getReferenceById(id);
        office.setAddress(office_view.getAddress());
        officeRepository.save(office);
    }


    public void deleteOffice(Long id) {
        if (!officeRepository.existsById(id)) {
            throw new RuntimeException("Office not found");
        }
        spotRepository.deleteAllByOfficeId(id);
        catRepository.deleteAllByOfficeId(id);
        officeRepository.deleteById(id);
    }


    public Category createCategory(CategoryView cat_view, Long officeId) {
        if (!officeRepository.existsById(officeId)) {
            throw new RuntimeException("Office not found");
        }
        if (catRepository.existsByNameAndOfficeId(cat_view.getName(), officeId)) {
            throw new RuntimeException("Category already exists in this office");
        }

        Category cat = new Category();
        cat.setName(cat_view.getName());
        cat.setSpotsName(cat_view.getSpotsName());
        cat.setSpot_count(cat_view.getSpot_count());
        cat.setOffice(officeRepository.findById(officeId).get());
        catRepository.save(cat);
        return cat;
    }

    public void deleteCategory(Long Id, Long officeId) {
        if (!officeRepository.existsById(officeId)) {
            throw new RuntimeException("Office not found");
        }
        if (!catRepository.existsById(Id)) {
            throw new RuntimeException("Category not found");
        }
        if (!catRepository.existsByIdAndOfficeId(Id, officeId)) {
            throw new RuntimeException("Category not exists in this office");
        }

        spotRepository.deleteAllByCategoryId(Id);
        catRepository.deleteById(Id);
    }

    public void updateCategory(Long Id, Long officeId, UpdateCategory update_category) {
        if (!officeRepository.existsById(officeId)) {
            throw new RuntimeException("Office not found");
        }
        if (!catRepository.existsById(Id)) {
            throw new RuntimeException("Category not found");
        }
        if (!catRepository.existsByIdAndOfficeId(Id, officeId)) {
            throw new RuntimeException("Category not exists in this office");
        }
        String name = update_category.getName();
        if (catRepository.existsByNameAndOfficeId(name, officeId)){
            throw new IllegalArgumentException("Category with this name already exists in this office");
        }
        Category category = catRepository.getReferenceById(Id);
        category.setName(update_category.getName());
        catRepository.save(category);
    }

    public List<GetCategory> getAllCategoryOffice(Long office_id) {
        if  (officeRepository.existsById(office_id)) {
            List<GetCategory> ans = new ArrayList<>();
            List<Category> category = catRepository.findByOfficeId(office_id);
            for(Category c : category){
                GetCategory getCategory = new GetCategory();
                getCategory.setId(c.getId());
                getCategory.setName(c.getName());
                ans.add(getCategory);
            }
            return ans;
        }
        else{
            throw new RuntimeException("Office not found");
        }
    }


    public void addSpot(AddSpot addSpot){
        if (officeRepository.existsById(addSpot.getOfficeId())) {
            if (catRepository.existsById(addSpot.getCategoryId())) {
                List<Category> categories = catRepository.findByOfficeId(addSpot.getOfficeId());
                Category category = catRepository.getReferenceById(addSpot.getCategoryId());
                if (categories.contains(category)) {
                    List<String> sp = Arrays.asList(category.getSpotsName().split(" "));
                    if (!sp.contains(addSpot.getNumber())){
                        category.setSpot_count(category.getSpot_count() + 1);
                        if (category.getSpotsName().isEmpty()){
                            category.setSpotsName(addSpot.getNumber());
                        }
                        else{
                            category.setSpotsName(category.getSpotsName() + " " + addSpot.getNumber());
                        }
                        catRepository.save(category);
                    }
                    else {
                        throw new IllegalArgumentException("Spot with such number already exists in this office");
                    }
                }
                else{
                    throw new IllegalArgumentException("invalid request");
                }
            }
            else{
                throw new RuntimeException("Office or category not found");
            }
        }
        else{
            throw new RuntimeException("Office or category not found");
        }
    }

    public void delete_Spot(AddSpot addSpot){
        if (officeRepository.existsById(addSpot.getOfficeId())) {
            if (catRepository.existsById(addSpot.getCategoryId())) {
                List<Category> categories = catRepository.findByOfficeId(addSpot.getOfficeId());
                Category category = catRepository.getReferenceById(addSpot.getCategoryId());
                if (categories.contains(category)) {
                    List<String> sp = Arrays.asList(category.getSpotsName().split(" "));
                    if (sp.contains(addSpot.getNumber())){
                        category.setSpot_count(category.getSpot_count() - 1);
                        String new_name = category.getSpotsName().replace(addSpot.getNumber() + " ", "");
                        new_name = new_name.replace(" " + addSpot.getNumber(), "");
                        new_name = new_name.replace(addSpot.getNumber(), "");
                        category.setSpotsName(new_name);
                        catRepository.save(category);
                        spotRepository.deleteAllBySpot_number(addSpot.getNumber(), addSpot.getCategoryId(), addSpot.getOfficeId());
                    }
                    else {
                        throw new RuntimeException("Spot not found");
                    }
                }
                else{
                    throw new IllegalArgumentException("invalid request");
                }
            }
            else{
                throw new RuntimeException("Office or category not found");
            }
        }
        else{
            throw new RuntimeException("Office or category not found");
        }
    }



    public List<UserView> getAllUser() {
        List<User> users = userRepository.findAll();
        List<UserView> user_views = new ArrayList<>();
        for (User user : users) {
            UserView user_view = new UserView();
            user_view.setEmail(user.getEmail());
            user_view.setLicensePlate(user.getCarNum());
            user_view.setId(user.getId());
            user_view.setName(user.getFullName());
            user_view.setRole(user.getRole());
            user_views.add(user_view);
        }
        return user_views;
    }

    public void updateUser(UpdateUser updateUser, Long id){
        if (userRepository.existsById(id)) {
            User user = userRepository.getReferenceById(id);
            user.setCarNum(updateUser.getLicensePlate());
            user.setFullName(updateUser.getName());
            userRepository.save(user);
        }
        else{
            throw new RuntimeException("User not found");
        }
    }

    public void deleteUser(Long id){
        if (userRepository.existsById(id)) {
            spotRepository.deleteAllByUserId(id);
            userRepository.deleteById(id);
        }
        else{
            throw new RuntimeException("User not found");
        }
    }


    public List<SpotResponse> getFreeSpots(SpotRequest spotRequest) {
        Long office_id = spotRequest.getOfficeId();
        if (!officeRepository.existsById(office_id)) {
            throw new RuntimeException("Office not found");
        }
        if (spotRequest.getEndTime().isBefore(spotRequest.getStartTime())){
            throw new IllegalArgumentException("Invalid date range");
        }
        Category cat = catRepository.getReferenceById(spotRequest.getCategoryId());
        Integer count = cat.getSpot_count();
        List<String> bookedSpots = spotRepository.ListSpotsBookedBetween(cat.getId(), office_id, spotRequest.getStartTime(), spotRequest.getEndTime());
        List<SpotResponse> spotResponses = new ArrayList<>();
        String[] sp = {};
        if (!cat.getSpotsName().isEmpty()) {
            sp = cat.getSpotsName().split(" ");
        }
        for (int i = 1; i < count + 1; i++) {
            String spotNum = Integer.toString(i);
            if (sp.length == count){
                spotNum = sp[i - 1];
            }
            if (!bookedSpots.contains(spotNum) ){
                SpotResponse spot = new SpotResponse();
                spot.setNumber(spotNum);
                spotResponses.add(spot);
            }
        }
        return spotResponses;
    }

    public Spot createSpot(BookingCreateRequest spotRequest, String email) {
        User user = userRepository.getReferenceByEmail(email);
        Long user_id = user.getId();
        Category category = catRepository.getReferenceById(spotRequest.getCategoryId());
        List<String> sp = Arrays.asList(category.getSpotsName().split(" "));

        if (spotRepository.isSpotBookedBetween(spotRequest.getCategoryId(), spotRequest.getOfficeId(), spotRequest.getNumber(), spotRequest.getStartTime(), spotRequest.getEndTime())){
            throw new RuntimeException("Spot already booked for this time");
        }
        if (spotRequest.getEndTime().isBefore(spotRequest.getStartTime())){
            throw new IllegalArgumentException("Invalid request");
        }

        if (!sp.contains(spotRequest.getNumber()) && sp.size() == category.getSpot_count()) {
            throw new IllegalArgumentException("Spot not found");
        }
        Spot spot = new Spot();
        spot.setSpot_number(spotRequest.getNumber());
        spot.setCategory(catRepository.getReferenceById(spotRequest.getCategoryId()));
        spot.setOffice(officeRepository.getReferenceById(spotRequest.getOfficeId()));
        spot.setUser(userRepository.getReferenceById(user_id));
        spot.setStart(spotRequest.getStartTime());
        spot.setFinish(spotRequest.getEndTime());
        return  spotRepository.save(spot);
    }

    public List<GetBooking> getActiveBooking(String email) {
        User user = userRepository.getReferenceByEmail(email);
        Long user_id = user.getId();
        List<Spot> spots = spotRepository.findByUser_id(user_id, ZonedDateTime.now());
        List<GetBooking> ans = new ArrayList<>();
        for (Spot spot : spots) {
            GetBooking getBooking = new GetBooking();
            getBooking.setId(spot.getId());
            getBooking.setOffice(spot.getOffice().getAddress());
            getBooking.setCategory(spot.getCategory().getName());
            getBooking.setSpotNumber(spot.getSpot_number());
            getBooking.setEndTime(spot.getFinish());
            getBooking.setStartTime(spot.getStart());
            ans.add(getBooking);

        }
        return ans;
    }

    public void deleteSpot(Long id, String email) {
        if (spotRepository.existsById(id)) {
            User user =  userRepository.getReferenceByEmail(email);
            Spot spot = spotRepository.getReferenceById(id);
            if (user.getId().equals(spot.getUser().getId())) {
                spotRepository.deleteById(id);
            }
            else{
                throw new RuntimeException("Forbidden (booking belongs to another user)");
            }
        }
        else{
            throw new IllegalArgumentException("Booking not found");
        }

    }

    public void blockSpot(BookingCreateRequest spotRequest, String email) {
        User user = userRepository.getReferenceByEmail(email);
        Long user_id = user.getId();
        Category category = catRepository.getReferenceById(spotRequest.getCategoryId());
        List<String> sp = Arrays.asList(category.getSpotsName().split(" "));

        if (spotRequest.getEndTime().isBefore(spotRequest.getStartTime())){
            throw new IllegalArgumentException("Invalid request");
        }

        if (!sp.contains(spotRequest.getNumber()) && sp.size() == category.getSpot_count()) {
            throw new RuntimeException("Spot not found");
        }
        Spot spot = new Spot();
        spot.setSpot_number(spotRequest.getNumber());
        spot.setCategory(catRepository.getReferenceById(spotRequest.getCategoryId()));
        spot.setOffice(officeRepository.getReferenceById(spotRequest.getOfficeId()));
        spot.setUser(userRepository.getReferenceById(user_id));
        spot.setStart(spotRequest.getStartTime());
        spot.setFinish(spotRequest.getEndTime());

        spotRepository.DeleteSpotBookedBetween(spotRequest.getCategoryId(), spotRequest.getOfficeId(), spotRequest.getNumber(), spotRequest.getStartTime(), spotRequest.getEndTime());
        spotRepository.save(spot);
    }

    public void unblockSpot(AddSpot spotRequest, String email) {
        User user = userRepository.getReferenceByEmail(email);
        Long userId = user.getId();
        Category cat = catRepository.getReferenceById(spotRequest.getCategoryId());
        if (!spotRepository.existSpotForUnblock(spotRequest.getNumber(), spotRequest.getCategoryId(), spotRequest.getOfficeId(), userId)){
            throw new RuntimeException("Spot not found");
        }
        if (!cat.getOffice().getId().equals(spotRequest.getOfficeId())) {
            throw new IllegalArgumentException("Invalid request");
        }
        spotRepository.deleteAllByParams(spotRequest.getNumber(), spotRequest.getCategoryId(), spotRequest.getOfficeId(), userId);
    }

    public List<SpotInfo> getSpotInfo(AddSpot spotRequest, String email) {
        User user = userRepository.getReferenceByEmail(email);
        Long userId = user.getId();
        Category cat = catRepository.getReferenceById(spotRequest.getCategoryId());
        if (!spotRepository.existSpotForUnblock(spotRequest.getNumber(), spotRequest.getCategoryId(), spotRequest.getOfficeId(), userId)){
            throw new RuntimeException("Spot not found");
        }
        if (!cat.getOffice().getId().equals(spotRequest.getOfficeId())) {
            throw new IllegalArgumentException("Invalid request");
        }
        List<SpotInfo> info = spotRepository.getSpotInfo(spotRequest.getNumber(), spotRequest.getCategoryId(), spotRequest.getOfficeId(), userId);
        return info;
    }



    public List<GetOfficeBooking> getOfficeBooking(Long office_id) {
        if (!officeRepository.existsById(office_id)) {
            throw new IllegalArgumentException("Office not found");
        }
        List<Category> categoryList = catRepository.findByOfficeId(office_id);
        List<GetOfficeBooking> ans = new ArrayList<>();
        for (Category cat : categoryList) {
            String[] names = cat.getSpotsName().split(" ");
            for (String name : names) {
                GetOfficeBooking booking = new GetOfficeBooking();
                booking.setNumber(name);
                booking.setCategory(cat.getName());
                if (spotRepository.existsSpotByParameters(cat.getId(), office_id, name, ZonedDateTime.now())){
                    Optional<Boolean> isBookedByAdmin = spotRepository.BookedByAdmin(cat.getId(), office_id, name);
                    if (isBookedByAdmin.isPresent()) {
                        booking.setAvailable(!isBookedByAdmin.get());
                    } else {
                        booking.setAvailable(true);
                    }
                }
                else{
                    booking.setAvailable(true);
                }
                ans.add(booking);
            }
        }
        return ans;
    }

    public String generatePassword(){
        PasswordGenerator generator = new PasswordGenerator();
        CharacterData specialChars = new CharacterData() {
            @Override
            public String getErrorCode() {
                return "";
            }

            @Override
            public String getCharacters() {
                return "/!@#$%^&*()_+-";
            }
        };
        List<CharacterRule> rules = Arrays.asList(
                new CharacterRule(EnglishCharacterData.UpperCase, 1),
                new CharacterRule(EnglishCharacterData.LowerCase, 1),
                new CharacterRule(EnglishCharacterData.Digit, 1),
                new CharacterRule(specialChars, 1)
        );
        return generator.generatePassword(10, rules);
    }

    public Map<String, ?> resetPassword(Long id, String password) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return Map.of("id", id, "password", password);
    }
}
