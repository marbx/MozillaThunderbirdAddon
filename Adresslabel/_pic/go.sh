rm -f addressLabel_Pref*.png
for f in addressLabel_Pref*.tiff; do 
  convert $f $f.png
done

